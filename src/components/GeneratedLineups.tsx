import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Download, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { Card, CardContent, CardHeader } from "./ui/card";

interface GeneratedLineupsProps {
  onBack: () => void;
}

const GeneratedLineups = ({ onBack }: GeneratedLineupsProps) => {
  const queryClient = useQueryClient();
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

  const handleClearAll = async () => {
    try {
      const { error } = await supabase
        .from('lineups')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all lineups

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
    return <div>No lineups generated yet.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Generated Lineups</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="text-primary hover:text-primary"
          >
            Back to Settings
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleClearAll}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2 bg-secondary hover:bg-secondary/90">
            <Download className="h-4 w-4" />
            Export to CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {lineups.map((lineup, index) => (
          <Card key={lineup.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => handleRemoveLineup(lineup.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-2">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Salary</div>
                  <div className="font-semibold">${lineup.total_salary.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">pOwn</div>
                  <div className="font-semibold">{lineup.total_ownership.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">fpts</div>
                  <div className="font-semibold">{lineup.projected_points.toFixed(2)}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Slot</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead className="text-right">Salary</TableHead>
                    <TableHead className="text-right">pOwn</TableHead>
                    <TableHead className="text-right">Fpts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineup.lineup_players.map((lp) => (
                    <TableRow key={`${lineup.id}-${lp.player.id}`}>
                      <TableCell>{lp.player.position}</TableCell>
                      <TableCell>
                        <div className="font-medium">{lp.player.team}</div>
                        {lp.player.name}
                      </TableCell>
                      <TableCell>{lp.player.team} @ {lp.player.opponent}</TableCell>
                      <TableCell className="text-right">${lp.player.salary.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{lp.player.ownership.toFixed(2)}%</TableCell>
                      <TableCell className="text-right">{lp.player.projected_points.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">${lineup.total_salary.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{lineup.total_ownership.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{lineup.projected_points.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GeneratedLineups;
