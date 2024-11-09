import { supabase } from "@/integrations/supabase/client";

export const analyzeSlate = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-slate');
    
    if (error) throw error;
    return data.adjustments;
  } catch (error) {
    console.error('Error analyzing slate:', error);
    throw error;
  }
};

export const getLatestAdjustments = async () => {
  try {
    const { data, error } = await supabase
      .from('player_adjustments')
      .select(`
        *,
        player:players (
          id,
          name,
          team,
          opponent
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching adjustments:', error);
    throw error;
  }
};