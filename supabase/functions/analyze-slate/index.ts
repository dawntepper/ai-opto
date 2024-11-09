import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    
    // Get the latest slate analysis
    const { data: slateAnalysis, error: slateError } = await supabase
      .from('slate_analysis')
      .select('content')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (slateError) throw slateError;

    // Get all available players
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .eq('status', 'available');

    if (playersError) throw playersError;

    // Use GPT-4 to analyze the slate content and generate player adjustments
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a DFS analyst. Analyze the slate notes and generate player projection adjustments.
                     Return a JSON array of objects with player adjustments based on the analysis.
                     Each object should have: playerId, projectionMultiplier, ownershipMultiplier, and reason.`
          },
          {
            role: 'user',
            content: `Slate Analysis: ${slateAnalysis.content}
                     Available Players: ${JSON.stringify(players.map(p => ({
                       id: p.id,
                       name: p.name,
                       team: p.team,
                       opponent: p.opponent,
                       position: p.position
                     })))}`
          }
        ],
      }),
    });

    const aiResponse = await response.json();
    const adjustments = JSON.parse(aiResponse.choices[0].message.content);

    // Store the adjustments in a new table
    const { error: insertError } = await supabase
      .from('player_adjustments')
      .insert(adjustments.map((adj: any) => ({
        player_id: adj.playerId,
        projection_multiplier: adj.projectionMultiplier,
        ownership_multiplier: adj.ownershipMultiplier,
        reason: adj.reason
      })));

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true, adjustments }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-slate function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});