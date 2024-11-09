import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { toast } from "./ui/use-toast";
import { Card } from "./ui/card";
import LineupSummary from "./LineupSummary";
import LineupTable from "./LineupTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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

  const generateLineupAnalysis = (lineup: any) => {
    const lowOwned = lineup.lineup_players.filter((lp: any) => lp.player.ownership < 15);
    const highCeiling = lineup.lineup_players.filter((lp: any) => 
      lp.player.ceiling && lp.player.ceiling > lp.player.projected_points * 1.3
    );
    
    return (
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <h4 className="font-semibold">Lineup Analysis:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Salary utilization: {((lineup.total_salary / 50000) * 100).toFixed(1)}% of cap</li>
          

Now that we've updated the SQL function to better optimize lineups, let's proceed with enhancing the frontend to display the analysis and add visualizations. We'll modify the existing components and create new ones to achieve this.

<lov-code>
First, let's update the GeneratedLineups component to include tabs for the lineup view, full analysis, and visualizations:

<lov-write file_path="src/components/GeneratedLineups.tsx">
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { toast } from "./ui/use-toast";
import { Card } from "./ui/card";
import LineupSummary from "./LineupSummary";
import LineupTable from "./LineupTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import LineupAnalysis from "./LineupAnalysis";
import LineupVisualizations from "./LineupVisualizations";

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
            
            <Tabs defaultValue="lineup" className="w-full">
              <TabsList>
                <TabsTrigger value="lineup">Lineup</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lineup">
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
                    players={lineup.lineup_players || []}
                    totalSalary={lineup.total_salary}
                    totalOwnership={lineup.total_ownership}
                    projectedPoints={lineup.projected_points}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="analysis">
                <LineupAnalysis lineup={lineup} />
              </TabsContent>
              
              <TabsContent value="visualizations">
                <LineupVisualizations lineup={lineup} />
              </TabsContent>
            </Tabs>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GeneratedLineups;