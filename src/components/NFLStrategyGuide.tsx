import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EntryType } from '@/types';
import { nflStrategies } from "@/types/nfl-strategy";
import { NFLStrategyContent } from "./NFLStrategyContent";

interface NFLStrategyGuideProps {
  entryType: EntryType;
}

const NFLStrategyGuide = ({ entryType }: NFLStrategyGuideProps) => {
  const currentStrategy = nflStrategies[entryType];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/5">
        <h2 className="text-2xl font-bold mb-4">{currentStrategy.title}</h2>
        
        <Tabs defaultValue="principles" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="principles">Key Principles</TabsTrigger>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
            <TabsTrigger value="stacking">Stacking</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <NFLStrategyContent strategy={currentStrategy} />
          </ScrollArea>
        </Tabs>
      </Card>
    </div>
  );
};

export default NFLStrategyGuide;