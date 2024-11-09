import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { exportLineupsToDraftKings } from "@/utils/exportLineups";

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

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Generated Lineups</h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export to DK
        </Button>
        <Button variant="outline" onClick={onClearAll}>Clear All</Button>
        <Button onClick={onBack}>Back to Settings</Button>
      </div>
    </div>
  );
};

export default LineupHeader;