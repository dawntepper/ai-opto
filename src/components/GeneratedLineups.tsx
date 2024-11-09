import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import LineupCard from "./LineupCard";
import LineupHeader from "./LineupHeader";

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
              opponent,
              ceiling
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lineups:', error);
        throw error;
      }
      
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
      <LineupHeader onBack={onBack} onClearAll={handleClearAll} />
      <div className="grid grid-cols-1 gap-6">
        {lineups.map((lineup, index) => (
          <LineupCard
            key={lineup.id}
            lineup={lineup}
            index={index}
            onRemove={handleRemoveLineup}
          />
        ))}
      </div>
    </div>
  );
};

export default GeneratedLineups;