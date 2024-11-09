import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X, AlertCircle } from "lucide-react";
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
    <Card key={lineup.id} className="relative p-6 bg-background border border-green-200 dark:border-green-800">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
        onClick={() => onRemove(lineup.id)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <Tabs defaultValue="lineup" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger 
            value="lineup"
            className="text-foreground data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Lineup
          </TabsTrigger>
          <TabsTrigger 
            value="analysis"
            className="text-foreground data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="visualizations"
            className="text-foreground data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Visualizations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="lineup" className="bg-background rounded-b-lg p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold text-foreground">{index + 1}</div>
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
        
        <TabsContent value="analysis" className="bg-background rounded-b-lg p-4">
          <LineupAnalysis lineup={lineup} />
        </TabsContent>
        
        <TabsContent value="visualizations" className="bg-background rounded-b-lg p-4">
          <LineupVisualizations lineup={lineup} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LineupCard;