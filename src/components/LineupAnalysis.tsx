import React from 'react';
import { AlertCircle, TrendingUp, Users, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface LineupAnalysisProps {
  lineup: any;
}

const LineupAnalysis: React.FC<LineupAnalysisProps> = ({ lineup }) => {
  const { data: slateAnalysis } = useQuery({
    queryKey: ['slateAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('slate_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const averageSalary = lineup.total_salary / lineup.lineup_players.length;
  const highCeilingPlayers = lineup.lineup_players.filter((lp: any) => 
    lp.player.ceiling && lp.player.ceiling > lp.player.projected_points * 1.2
  );
  const lowOwnershipPlayers = lineup.lineup_players.filter((lp: any) => 
    lp.player.ownership < 10
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
        Lineup Analysis
      </h3>

      {/* Key Insights at the top */}
      <div className="bg-background p-4 rounded-lg border border-border">
        <h4 className="font-semibold mb-2 text-foreground">Key Insights:</h4>
        <ul className="list-disc pl-5 space-y-2 text-foreground">
          <li>This lineup leverages {highCeilingPlayers.length} high-ceiling players for tournament upside.</li>
          <li>It includes {lowOwnershipPlayers.length} low-ownership players for differentiation.</li>
          <li>The average salary utilization is efficient at ${averageSalary.toFixed(0)} per player.</li>
          {slateAnalysis?.content && (
            <li className="text-green-600 dark:text-green-400">
              Slate Note: {slateAnalysis.content.split('\n')[0]}
            </li>
          )}
        </ul>
      </div>
      
      <div className="bg-background p-4 rounded-lg border border-border">
        <ul className="list-disc pl-5 space-y-2 text-foreground">
          <li>Total Salary: ${lineup.total_salary.toLocaleString()} (Avg: ${averageSalary.toFixed(0)})</li>
          <li>Projected Points: {lineup.projected_points.toFixed(2)}</li>
          <li>Total Ownership: {lineup.total_ownership.toFixed(2)}%</li>
          <li>High Ceiling Players: {highCeilingPlayers.length}</li>
          <li>Low Ownership Players: {lowOwnershipPlayers.length}</li>
        </ul>
      </div>

      {slateAnalysis ? (
        <Collapsible className="w-full" defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-background rounded-t-lg border border-border hover:bg-accent transition-colors">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              Additional Data/Info
            </div>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 text-foreground" />
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-background p-4 rounded-b-lg border-x border-b border-border">
            <p className="whitespace-pre-wrap text-foreground">{slateAnalysis.content}</p>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <p>No additional data available</p>
        </div>
      )}
    </div>
  );
};

export default LineupAnalysis;