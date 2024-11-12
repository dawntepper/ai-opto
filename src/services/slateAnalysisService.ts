import { supabase } from "@/integrations/supabase/client";

export const analyzeSlate = async () => {
  try {
    // First fetch updates from X
    const { error: fetchError } = await supabase.functions.invoke('fetch-underdog-updates');
    
    if (fetchError) {
      console.error('Error fetching updates:', fetchError);
      throw fetchError;
    }

    // Then get the latest slate analysis
    const { data, error } = await supabase
      .from('slate_analysis')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error getting slate analysis:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error analyzing slate:', error);
    throw error;
  }
};