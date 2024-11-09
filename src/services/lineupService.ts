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
  
  const { data, error } = await supabase
    .rpc('generate_optimal_lineups', {
      settings_id: settingsId
    }) as { data: GeneratedLineup[] | null, error: any };

  console.log('RPC response received:', { 
    hasData: !!data, 
    dataType: data ? typeof data : 'null',
    isArray: Array.isArray(data),
    error: error || 'none' 
  });

  if (error) {
    console.error('Failed to generate lineups:', error);
    throw error;
  }

  if (!data || !Array.isArray(data)) {
    console.error('Invalid lineup data received:', data);
    throw new Error(`Invalid response format: expected array but got ${typeof data}`);
  }

  console.log(`Successfully generated ${data.length} lineups`);
  return data;
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