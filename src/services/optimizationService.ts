import { supabase } from "@/integrations/supabase/client";
import { OptimizationSettings, Sport } from "../types";

export const validateSettings = (settings: OptimizationSettings) => {
  if (settings.maxSalary > 50000) {
    throw new Error("Maximum salary cap cannot exceed $50,000");
  }
  if (settings.maxSalary < 47500) {
    throw new Error("Minimum salary cap cannot be less than $47,500");
  }
};

export const getValidPlayersStats = async (sport: Sport = 'nba') => {
  console.log('Getting valid players stats for sport:', sport);
  
  const { data: players, error } = await supabase
    .from('players')
    .select('salary, projected_points')
    .eq('status', 'available')
    .eq('sport', sport)
    .gt('salary', 0)
    .gt('projected_points', 0);

  if (error) throw error;

  if (!players || players.length === 0) {
    throw new Error(`No valid ${sport.toUpperCase()} players found with non-zero salary and projected points`);
  }

  const totalSalary = players.reduce((sum, p) => sum + p.salary, 0);
  const avgSalary = totalSalary / players.length;

  const stats = `Found ${players.length} valid ${sport.toUpperCase()} players with average salary $${Math.round(avgSalary)}`;
  console.log(stats);

  return {
    count: players.length,
    totalSalary,
    avgSalary,
    stats
  };
};