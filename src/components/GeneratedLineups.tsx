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

    // Convert lineups to CSV format
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
      <div className="flex justify-end">
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lineup</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Proj. Points</TableHead>
              <TableHead>Ownership</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineups.map((lineup, index) => (
              <TableRow key={lineup.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {lineup.lineup_players.map(lp => (
                      <span key={lp.player.id} className="text-xs bg-secondary/20 px-2 py-1 rounded">
                        {lp.player.position} {lp.player.name}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>${lineup.total_salary.toLocaleString()}</TableCell>
                <TableCell>{lineup.projected_points.toFixed(2)}</TableCell>
                <TableCell>{lineup.total_ownership.toFixed(1)}%</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(lineup.id)}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GeneratedLineups;