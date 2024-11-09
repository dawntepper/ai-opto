import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  ResponsiveContainer
} from 'recharts';

const LineupAnalysis = () => {
  const { data: lineups, isLoading } = useQuery({
    queryKey: ['lineups-analysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lineups')
        .select(`
          *,
          lineup_players (
            player:players (
              id,
              name,
              position,
              salary,
              projected_points,
              ownership,
              team
            )
          )
        `)
        .order('projected_points', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading analysis...</div>;

  if (!lineups?.length) {
    return <div>No lineups available for analysis. Generate some lineups in the Player Pool tab.</div>;
  }

  // Prepare data for visualizations
  const salaryVsPoints = lineups.map(lineup => ({
    salary: lineup.total_salary,
    points: parseFloat(lineup.projected_points.toFixed(2))
  }));

  const teamExposure = lineups.reduce((acc: Record<string, number>, lineup) => {
    lineup.lineup_players.forEach(lp => {
      const team = lp.player.team;
      acc[team] = (acc[team] || 0) + 1;
    });
    return acc;
  }, {});

  const teamExposureData = Object.entries(teamExposure).map(([team, count]) => ({
    team,
    count
  }));

  return (
    <ScrollArea className="h-[800px]">
      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Lineup Analysis</h2>
          <p className="mb-6">
            This analysis shows the relationship between salary usage and projected points,
            as well as team exposure across all lineups. Higher correlation between salary
            and projected points suggests efficient salary usage.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Salary vs. Projected Points</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis 
                name="Salary" 
                dataKey="salary"
                type="number"
                domain={['auto', 'auto']}
                label={{ value: 'Salary', position: 'bottom' }}
              />
              <YAxis 
                name="Projected Points" 
                dataKey="points"
                label={{ value: 'Projected Points', angle: -90, position: 'left' }}
              />
              <Tooltip 
                formatter={(value: any) => value.toFixed(2)}
                labelFormatter={(value) => `Salary: $${value}`}
              />
              <Scatter name="Lineups" data={salaryVsPoints} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Team Exposure</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={teamExposureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" name="Players" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default LineupAnalysis;