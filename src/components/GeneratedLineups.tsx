import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Download, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "./ui/use-toast";

const GeneratedLineups = () => {
  const [editingLineupId, setEditingLineupId] = useState<string | null>(null);

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
              ownership
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleExport = () => {
    if (!lineups?.length) return;

    const csvContent = lineups.map(lineup => {
      const players = lineup.lineup_players.map(lp => lp.player);
      return `${players.map(p => p.name).join(',')},${lineup.total_salary},${lineup.projected_points.toFixed(2)},${lineup.total_ownership.toFixed(2)}`;
    }).join('\n');

    const header = 'Players,Total Salary,Projected Points,Total Ownership\n';
    const blob = new Blob([header + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimal_lineups.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Lineups Exported",
      description: "Your lineups have been exported to CSV successfully."
    });
  };

  const handleEdit = (lineupId: string) => {
    setEditingLineupId(lineupId);
    toast({
      title: "Edit Mode",
      description: "Editing functionality will be implemented in a future update."
    });
  };

  if (isLoading) {
    return <div>Loading lineups...</div>;
  }

  if (!lineups?.length) {
    return <div>No lineups generated yet.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Generated Lineups</h2>
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="text-primary hover:text-primary"
        >
          Back to Settings
        </Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleExport} className="flex items-center gap-2 bg-secondary hover:bg-secondary/90">
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lineup #</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Salary</TableHead>
              <TableHead className="text-right">Own%</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineups.map((lineup, lineupIndex) => (
              <>
                {lineup.lineup_players.map((lp, playerIndex) => (
                  <TableRow 
                    key={`${lineup.id}-${lp.player.id}`}
                    className={playerIndex === lineup.lineup_players.length - 1 ? "border-b-4" : ""}
                  >
                    {playerIndex === 0 && (
                      <TableCell rowSpan={lineup.lineup_players.length} className="align-top pt-4">
                        {lineupIndex + 1}
                      </TableCell>
                    )}
                    <TableCell>{lp.player.position}</TableCell>
                    <TableCell>{lp.player.name}</TableCell>
                    <TableCell className="text-right">${lp.player.salary.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{lp.player.ownership.toFixed(1)}%</TableCell>
                    {playerIndex === 0 && (
                      <TableCell rowSpan={lineup.lineup_players.length} className="align-top pt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(lineup.id)}
                          className="flex items-center gap-1 text-secondary hover:text-secondary/90"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                <TableRow className="bg-secondary/5">
                  <TableCell colSpan={2} className="font-medium">
                    Lineup Totals
                  </TableCell>
                  <TableCell />
                  <TableCell className="text-right font-medium">
                    ${lineup.total_salary.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {lineup.total_ownership.toFixed(1)}%
                  </TableCell>
                  <TableCell />
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GeneratedLineups;