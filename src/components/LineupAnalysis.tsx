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
    <div className="space-y-4 text-gray-900 dark:text-gray-100">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-green-600" />
        Lineup Analysis
      </h3>

      {/* Key Insights at the top */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold mb-2">Key Insights:</h4>
        <ul className="list-disc pl-5 space-y-2">
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
      
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <ul className="list-disc pl-5 space-y-2">
          <li>Total Salary: ${lineup.total_salary.toLocaleString()} (Avg: ${averageSalary.toFixed(0)})</li>
          <li>Projected Points: {lineup.projected_points.toFixed(2)}</li>
          <li>Total Ownership: {lineup.total_ownership.toFixed(2)}%</li>
          <li>High Ceiling Players: {highCeilingPlayers.length}</li>
          <li>Low Ownership Players: {lowOwnershipPlayers.length}</li>
        </ul>
      </div>

      {slateAnalysis ? (
        <Collapsible className="w-full" defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-t-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-2 font-semibold">
              <Users className="h-5 w-5 text-green-600" />
              Additional Data/Info
            </div>
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-white dark:bg-gray-900 p-4 rounded-b-lg border-x border-b border-gray-200 dark:border-gray-700">
            <p className="whitespace-pre-wrap">{slateAnalysis.content}</p>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <AlertCircle className="h-5 w-5" />
          <p>No additional data available</p>
        </div>
      )}
    </div>
  );
};

export default LineupAnalysis;