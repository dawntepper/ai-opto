import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { toast } from "./ui/use-toast";
import { Card } from "./ui/card";
import LineupSummary from "./LineupSummary";
import LineupTable from "./LineupTable";

interface GeneratedLineupsProps {
  onBack: () => void;
}

const GeneratedLineups = ({ onBack }: GeneratedLineupsProps) => {
  const queryClient = useQueryClient();

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

  const handleClearAll = async () => {
    try {
      const { error } = await supabase
        .from('lineups')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['lineups'] });
      toast({
        title: "Lineups Cleared",
        description: "All lineups have been removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear lineups",
        variant: "destructive"
      });
    }
  };

  const handleRemoveLineup = async (lineupId: string) => {
    try {
      const { error } = await supabase
        .from('lineups')
        .delete()
        .eq('id', lineupId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['lineups'] });
      toast({
        title: "Lineup Removed",
        description: "The lineup has been removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove lineup",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Loading lineups...</div>;
  }

  if (!lineups?.length) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Generated Lineups</h2>
          <Button onClick={onBack}>Back to Settings</Button>
        </div>
        <div>No lineups generated yet.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Generated Lineups</h2>
        <div className="flex gap-2">
          <Button onClick={onBack}>Back to Settings</Button>
          <Button variant="destructive" onClick={handleClearAll}>
            Clear All Lineups
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {lineups.map((lineup, index) => (
          <Card key={lineup.id} className="relative p-6">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => handleRemoveLineup(lineup.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="text-lg font-semibold">{index + 1}</div>
                <LineupSummary
                  totalSalary={lineup.total_salary}
                  totalOwnership={lineup.total_ownership}
                  projectedPoints={lineup.projected_points}
                />
              </div>

              <LineupTable
                players={lineup.lineup_players}
                totalSalary={lineup.total_salary}
                totalOwnership={lineup.total_ownership}
                projectedPoints={lineup.projected_points}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GeneratedLineups;