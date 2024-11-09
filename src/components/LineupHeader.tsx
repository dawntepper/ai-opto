import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { exportLineupsToDraftKings } from "@/utils/exportLineups";
import { toast } from "./ui/use-toast";

interface LineupHeaderProps {
  onBack: () => void;
  onClearAll: () => void;
}

const LineupHeader = ({ onBack, onClearAll }: LineupHeaderProps) => {
  const { data: lineups } = useQuery({
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
              partner_id,
              roster_positions
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleExport = () => {
    if (lineups) {
      exportLineupsToDraftKings(lineups);
    }
  };

  const handleClear = async () => {
    try {
      const { error: lineupPlayersError } = await supabase
        .from('lineup_players')
        .delete()
        .neq('lineup_id', '00000000-0000-0000-0000-000000000000');

      if (lineupPlayersError) throw lineupPlayersError;

      const { error: lineupsError } = await supabase
        .from('lineups')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (lineupsError) throw lineupsError;

      onClearAll();
      toast({
        title: "Success",
        description: "All lineups have been cleared",
      });
    } catch (error) {
      console.error('Error clearing lineups:', error);
      toast({
        title: "Error",
        description: "Failed to clear lineups",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Generated Lineups</h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleExport} className="text-primary">
          <Download className="h-4 w-4 mr-2" />
          Export to DK
        </Button>
        <Button variant="outline" onClick={handleClear} className="text-primary">Clear All</Button>
        <Button onClick={onBack}>Back to Settings</Button>
      </div>
    </div>
  );
};

export default LineupHeader;