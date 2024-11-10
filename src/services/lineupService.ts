import { supabase } from "@/integrations/supabase/client";
import { OptimizationSettings, Sport } from "../types";

interface GeneratedLineup {
  lineup_id: string;
  total_salary: number;
  projected_points: number;
  total_ownership: number;
}

export const saveOptimizationSettings = async (settings: OptimizationSettings) => {
  console.log('Saving optimization settings:', settings);
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
  
  console.log('Successfully saved optimization settings:', data);
  return data;
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

export const generateLineups = async (settingsId: string): Promise<GeneratedLineup[]> => {
  console.log('Starting lineup generation with settings ID:', settingsId);
  
  try {
    const { data: settings, error: settingsError } = await supabase
      .from('optimization_settings')
      .select('sport')
      .eq('id', settingsId)
      .single();

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      throw settingsError;
    }

    console.log('Retrieved settings:', settings);

    if (!settings.sport) {
      console.error('Invalid sport type:', settings.sport);
      throw new Error('Invalid sport type');
    }

    const validPlayersCount = await checkValidPlayers(settings.sport);
    console.log(`Found ${validPlayersCount} valid players for ${settings.sport}`);

    if (validPlayersCount < 8) {
      throw new Error(`Need at least 8 valid ${settings.sport.toUpperCase()} players with non-zero salary and projected points`);
    }

    console.log('Calling generate_optimal_lineups function...');
    const { data, error } = await supabase
      .rpc('generate_optimal_lineups', {
        settings_id: settingsId
      });

    if (error) {
      console.error('Failed to generate lineups:', error);
      throw error;
    }

    if (!data) {
      console.error('No data received from lineup generation');
      throw new Error('No data received from lineup generation');
    }

    const lineups = Array.isArray(data) ? data : [data];
    console.log(`Successfully generated ${lineups.length} lineups`);
    
    return lineups;

  } catch (error: any) {
    console.error('Lineup generation error:', error);
    throw new Error(error.message || 'Failed to generate lineups');
  }
};