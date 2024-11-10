import { supabase } from "@/integrations/supabase/client";

export const updateDefensiveMatchups = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('update-defensive-matchups');
    
    if (error) {
      console.error('Error updating defensive matchups:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating defensive matchups:', error);
    throw error;
  }
};

export const getDefensiveMatchups = async (team?: string, position?: string) => {
  let query = supabase
    .from('defensive_matchups')
    .select('*')
    .order('rank', { ascending: true });

  if (team) {
    query = query.eq('team', team);
  }
  
  if (position) {
    query = query.eq('position', position);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};