import { supabase } from "@/integrations/supabase/client";
import { OptimizationSettings } from "../types";

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
      min_value: 0
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
    // Use single() to ensure we get a single response object
    const { data, error } = await supabase
      .rpc('generate_optimal_lineups', {
        settings_id: settingsId
      })
      .single();

    if (error) {
      console.error('Failed to generate lineups:', error);
      throw error;
    }

    // Immediately after getting the response, check if it's valid
    if (!data) {
      throw new Error('No data received from lineup generation');
    }

    // Convert the single response into an array with one lineup
    const lineup = {
      lineup_id: data.lineup_id,
      total_salary: data.total_salary,
      projected_points: data.projected_points,
      total_ownership: data.total_ownership
    };

    return [lineup];
  } catch (error: any) {
    console.error('Lineup generation error:', error);
    throw new Error(error.message || 'Failed to generate lineups');
  }
};

export const checkValidPlayers = async () => {
  const { count, error } = await supabase
    .from('players')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'available')
    .gt('salary', 0)
    .gt('projected_points', 0);

  if (error) throw error;
  return count || 0;
};