import { supabase } from "@/integrations/supabase/client";

export const analyzeSlate = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-slate');
    
    if (error) {
      console.error('Error analyzing slate:', error);
      throw error;
    }

    return data.adjustments;
  } catch (error) {
    console.error('Error analyzing slate:', error);
    throw error;
  }
};