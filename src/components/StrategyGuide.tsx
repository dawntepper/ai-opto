import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EntryType } from '@/types';
import { strategies } from "@/types/strategy";
import { StrategyContent } from "./StrategyContent";

interface StrategyGuideProps {
  entryType: EntryType;
}

const StrategyGuide = ({ entryType }: StrategyGuideProps) => {
  const generalConcepts = [
    "Player Correlation: Teammates who succeed together",
    "Game Stacks: Multiple players from high-scoring games",
    "Leverage: Being overweight on low-owned, high-upside players",
    "Differentiation: Creating unique lineup constructions",
    "Ceiling Chasing: Targeting players with tournament-winning upside",
    "Late Swap: Utilizing late games for ownership leverage",
    "Injury Impact: Leveraging news and projected role changes"
  ];

  const currentStrategy = strategies[entryType];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/5">
        <h2 className="text-2xl font-bold mb-4">General Tournament Concepts</h2>
        <ul className="space-y-2">
          {generalConcepts.map((concept, index) => (
            <li key={index} className="flex items-start">
              <span className="text-secondary mr-2">•</span>
              {concept}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6 bg-white/5">
        <h2 className="text-2xl font-bold mb-4">{currentStrategy.title}</h2>
        
        <Tabs defaultValue="principles" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="principles">Key Principles</TabsTrigger>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
            <TabsTrigger value="builds">Build Types</TabsTrigger>
            {(currentStrategy.type === 'single' || currentStrategy.type === '3-max') && (
              <TabsTrigger value="game-selection">Game Selection</TabsTrigger>
            )}
            {currentStrategy.type === 'single' && <TabsTrigger value="checklist">Checklist</TabsTrigger>}
            {currentStrategy.type === '20-max' && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
            {currentStrategy.type === '20-max' && <TabsTrigger value="implementation">Implementation</TabsTrigger>}
          </TabsList>

          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <StrategyContent strategy={currentStrategy} />
          </ScrollArea>
        </Tabs>
      </Card>
    </div>
  );
};

export default StrategyGuide;