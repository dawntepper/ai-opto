import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import LineupSummary from "./LineupSummary";
import LineupTable from "./LineupTable";
import LineupAnalysis from "./LineupAnalysis";
import LineupVisualizations from "./LineupVisualizations";

interface LineupCardProps {
  lineup: any;
  index: number;
  onRemove: (lineupId: string) => void;
}

const LineupCard = ({ lineup, index, onRemove }: LineupCardProps) => {
  return (
    <Card key={lineup.id} className="relative p-6 bg-white dark:bg-gray-800 border-green-100">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        onClick={() => onRemove(lineup.id)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <Tabs defaultValue="lineup" className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-700">
          <TabsTrigger 
            value="lineup"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Lineup
          </TabsTrigger>
          <TabsTrigger 
            value="analysis"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="visualizations"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Visualizations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="lineup">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{index + 1}</div>
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
  );
};

export default LineupCard;