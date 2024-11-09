import { supabase } from "@/integrations/supabase/client";
import { OptimizationSettings } from "../types";

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

  if (error) throw error;
  return data;
};

export const generateLineups = async (settingsId: string) => {
  try {
    const response = await supabase
      .rpc('generate_optimal_lineups', {
        settings_id: settingsId
      });

    if (response.error) {
      console.error('RPC Error:', response.error);
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('No lineups were generated');
    }

    return response.data;
  } catch (error: any) {
    console.error('Error in generateLineups:', error);
    throw error;
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