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
  console.log('Generating lineups with settings ID:', settingsId);
  
  const { data, error } = await supabase
    .rpc('generate_optimal_lineups', {
      settings_id: settingsId
    });

  if (error) {
    console.error('RPC Error:', error);
    throw new Error(`Failed to generate lineups: ${error.message}`);
  }

  if (!data || !Array.isArray(data)) {
    console.error('Invalid response data:', data);
    throw new Error('Invalid response from lineup generation');
  }

  console.log('Generated lineups:', data);
  return data as GeneratedLineup[];
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