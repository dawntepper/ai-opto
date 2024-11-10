import { supabase } from "@/integrations/supabase/client";
import { OptimizationSettings, Sport } from "../types";

interface GeneratedLineup {
  lineup_id: string;
  total_salary: number;
  projected_points: number;
  total_ownership: number;
}

export const saveOptimizationSettings = async (settings: OptimizationSettings) => {
  const { data, error } = await supabase
    .from('optimization_settings')
    .insert({
      entry_type: settings.entryType,
      max_salary: settings.maxSalary,
      max_ownership: settings.maxOwnership,
      correlation_strength: settings.correlationStrength,
      lineup_count: settings.lineupCount,
      min_value: 0,
      sport: settings.sport
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving optimization settings:', error);
    throw error;
  }
  
  return data;
};

export const generateLineups = async (settingsId: string): Promise<GeneratedLineup[]> => {
  console.log('Starting lineup generation with settings ID:', settingsId);
  
  try {
    // First get the sport from the settings
    const { data: settings, error: settingsError } = await supabase
      .from('optimization_settings')
      .select('sport')
      .eq('id', settingsId)
      .single();

    if (settingsError) throw settingsError;

    // Validate we have enough players for the specific sport
    const validPlayersCount = await checkValidPlayers(settings.sport);
    if (validPlayersCount < 8) {
      throw new Error(`Need at least 8 valid ${settings.sport.toUpperCase()} players with non-zero salary and projected points`);
    }

    const { data, error } = await supabase
      .rpc('generate_optimal_lineups', {
        settings_id: settingsId
      });

    if (error) {
      console.error('Failed to generate lineups:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data received from lineup generation');
    }

    const lineups = Array.isArray(data) ? data : [data];
    
    return lineups.map(lineup => ({
      lineup_id: lineup.lineup_id,
      total_salary: lineup.total_salary,
      projected_points: lineup.projected_points,
      total_ownership: lineup.total_ownership
    }));

  } catch (error: any) {
    console.error('Lineup generation error:', error);
    throw new Error(error.message || 'Failed to generate lineups');
  }
};

export const checkValidPlayers = async (sport: Sport = 'nba') => {
  console.log('Checking valid players for sport:', sport);
  
  const { count, error } = await supabase
    .from('players')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'available')
    .eq('sport', sport)
    .gt('salary', 0)
    .gt('projected_points', 0);

  if (error) {
    console.error('Error checking valid players:', error);
    throw error;
  }

  console.log(`Found ${count} valid ${sport} players`);
  return count || 0;
};