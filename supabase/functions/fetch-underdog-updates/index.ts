import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const twitterApiKey = Deno.env.get('TWITTER_BEARER_TOKEN')
    if (!twitterApiKey) {
      throw new Error('Twitter API key not configured')
    }

    // Fetch latest tweets from Underdog NBA
    const response = await fetch(
      'https://api.twitter.com/2/users/1443293132812505089/tweets?max_results=10&tweet.fields=created_at,text', 
      {
        headers: {
          'Authorization': `Bearer ${twitterApiKey}`,
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Fetched tweets:', data)

    // Process tweets for relevant information
    const updates = processTweets(data.data)
    console.log('Processed updates:', updates)

    // Update player information in database
    for (const update of updates) {
      const { error } = await supabase
        .from('players')
        .update({
          minutes: update.minutes,
          status: update.status,
          updated_at: new Date().toISOString()
        })
        .eq('name', update.playerName)

      if (error) {
        console.error('Error updating player:', error)
      }
    }

    // Create slate analysis entry
    const { error: slateError } = await supabase
      .from('slate_analysis')
      .insert({
        content: generateSlateAnalysis(updates),
      })

    if (slateError) {
      console.error('Error creating slate analysis:', slateError)
    }

    return new Response(
      JSON.stringify({ message: 'Successfully processed updates', updates }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing updates:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function processTweets(tweets: any[]): any[] {
  const updates: any[] = []
  
  for (const tweet of tweets) {
    // Process starting lineup announcements
    if (tweet.text.toLowerCase().includes('starting lineup')) {
      const players = extractPlayers(tweet.text)
      players.forEach(player => {
        updates.push({
          playerName: player,
          status: 'starting',
          minutes: null
        })
      })
    }

    // Process injury updates
    if (tweet.text.toLowerCase().includes('out') || 
        tweet.text.toLowerCase().includes('questionable')) {
      const status = tweet.text.toLowerCase().includes('out') ? 'out' : 'questionable'
      const playerName = extractPlayerName(tweet.text)
      if (playerName) {
        updates.push({
          playerName,
          status,
          minutes: null
        })
      }
    }

    // Process minutes restrictions
    if (tweet.text.toLowerCase().includes('minutes')) {
      const { player, minutes } = extractMinutesInfo(tweet.text)
      if (player && minutes) {
        updates.push({
          playerName: player,
          status: 'available',
          minutes
        })
      }
    }
  }

  return updates
}

function extractPlayers(text: string): string[] {
  // Basic implementation - would need to be enhanced based on actual tweet formats
  return text
    .split(':')[1]?.split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0) || []
}

function extractPlayerName(text: string): string | null {
  // Basic implementation - would need to be enhanced based on actual tweet formats
  const words = text.split(' ')
  return words.length >= 2 ? `${words[0]} ${words[1]}` : null
}

function extractMinutesInfo(text: string): { player: string | null, minutes: number | null } {
  // Basic implementation - would need to be enhanced based on actual tweet formats
  const minutesMatch = text.match(/(\d+)\s*minutes/)
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : null
  const player = extractPlayerName(text)
  
  return { player, minutes }
}

function generateSlateAnalysis(updates: any[]): string {
  const timestamp = new Date().toLocaleString()
  let analysis = `Latest Updates (${timestamp}):\n\n`
  
  const startingPlayers = updates.filter(u => u.status === 'starting')
  const injuredPlayers = updates.filter(u => u.status === 'out' || u.status === 'questionable')
  const minutesRestrictions = updates.filter(u => u.minutes !== null)
  
  if (startingPlayers.length > 0) {
    analysis += "Starting Lineups:\n"
    startingPlayers.forEach(p => {
      analysis += `- ${p.playerName} (Starting)\n`
    })
    analysis += "\n"
  }
  
  if (injuredPlayers.length > 0) {
    analysis += "Injury Updates:\n"
    injuredPlayers.forEach(p => {
      analysis += `- ${p.playerName} (${p.status})\n`
    })
    analysis += "\n"
  }
  
  if (minutesRestrictions.length > 0) {
    analysis += "Minutes Restrictions:\n"
    minutesRestrictions.forEach(p => {
      analysis += `- ${p.playerName} (${p.minutes} minutes)\n`
    })
  }
  
  return analysis
}