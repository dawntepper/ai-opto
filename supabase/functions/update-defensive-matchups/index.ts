import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the webpage
    const response = await fetch('https://fantasydata.com/nfl/fantasy-football-points-allowed-defense-by-position?scope=season&sp=2024_REG&scoring=fpts_draftkings&order_by=opp_fpts_draftkings_per_gp&sort_dir=desc');
    const html = await response.text();
    const $ = cheerio.load(html);

    const matchupData = [];
    
    // Parse the table data
    $('.datatable tbody tr').each((_, row) => {
      const cols = $(row).find('td');
      const team = $(cols[0]).text().trim();
      const pointsAllowed = parseFloat($(cols[2]).text().trim());
      const rank = parseInt($(cols[1]).text().trim());
      
      // Store data for each position
      ['QB', 'RB', 'WR', 'TE'].forEach(position => {
        matchupData.push({
          team,
          position,
          points_allowed_per_game: pointsAllowed,
          rank,
          season: '2024',
          week: null // null for season-long stats
        });
      });
    });

    // Update database
    const { error } = await supabase
      .from('defensive_matchups')
      .upsert(matchupData, {
        onConflict: 'team,position,season,week',
        ignoreDuplicates: false
      });

    if (error) throw error;

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Defensive matchups updated',
      count: matchupData.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});