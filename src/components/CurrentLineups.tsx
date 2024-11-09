import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LineupTable from "./LineupTable";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

const CurrentLineups = () => {
  const { data: lineups, isLoading } = useQuery({
    queryKey: ['lineups'],
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
              team,
              opponent
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading lineups...</div>;

  if (!lineups?.length) {
    return <div>No lineups generated yet. Generate some lineups in the Player Pool tab.</div>;
  }

  return (
    <ScrollArea className="h-[800px]">
      <div className="space-y-6">
        {lineups.map((lineup, index) => (
          <Card key={lineup.id} className="p-6">
            <div className="space-y-4">
              <div className="text-lg font-semibold">Lineup {index + 1}</div>
              <LineupTable
                players={lineup.lineup_players || []}
                totalSalary={lineup.total_salary}
                totalOwnership={lineup.total_ownership}
                projectedPoints={lineup.projected_points}
              />
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CurrentLineups;