import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EntryType } from '../types';

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

  const strategies = {
    single: {
      title: "Single-Entry Strategy",
      keyPrinciples: [
        "Mix of chalk and contrarian plays",
        "1-2 leverage plays maximum",
        "Target 2-3 correlated players",
        "One game stack maximum"
      ],
      ownershipManagement: [
        "Aim for 1-2 players under 10% ownership",
        "Can use 1-2 chalk plays (>25% owned)",
        "Overall lineup ownership under 100% cumulative"
      ],
      rosterConstruction: [
        "Use conventional builds (1-2 value plays)",
        "Target one spend-up spot (typically stud PG or C)",
        "Maintain flexibility for late swap",
        "Focus on minutes security"
      ],
      checklist: [
        "Maximum two players from same team",
        "At least one sub-10% owned player",
        "No more than two sub-$4,000 players",
        "One player projected over 50 DK points",
        "Clear path to 350+ DK points"
      ]
    },
    '3-max': {
      title: "3-Max Strategy",
      keyPrinciples: [
        "Each lineup should have 4+ different players",
        "Vary spend-up spots across lineups",
        "Different game stack targets",
        "Mix of chalk and contrarian approaches"
      ],
      ownershipStructure: [
        "Line 1: More balanced (80-120% cumulative)",
        "Line 2: More contrarian (60-100% cumulative)",
        "Line 3: Leverage-focused (<80% cumulative)"
      ],
      coreManagement: [
        "Maximum 3 players in all lineups",
        "Different captains/multiplier spots",
        "Vary correlation strategies"
      ],
      buildTypes: [
        "Balanced Build: 2-3 value plays, even salary distribution",
        "Stars & Scrubs: 2 studs + value, extreme salary distribution",
        "Game Stack Focus: Heavy game correlation, related player outcomes"
      ]
    },
    '20-max': {
      title: "20-Max Strategy",
      keyPrinciples: [
        "Clear player exposure rules",
        "Systematic game stack approach",
        "Defined correlation rules",
        "Strategic ownership deviation"
      ],
      portfolioManagement: [
        "25% chalk builds",
        "50% balanced builds",
        "25% contrarian builds",
        "Maximum 40% exposure to any player"
      ],
      buildTypes: [
        "5 lineups: Traditional builds",
        "5 lineups: Game stacks",
        "5 lineups: Stars/Scrubs",
        "5 lineups: Contrarian builds"
      ],
      advancedConcepts: [
        "Strategic exposure to different ownership tiers",
        "If Player A, then Player B at >50%",
        "Predetermined swap rules",
        "Core players (30-40% exposure)",
        "Secondary players (15-25% exposure)",
        "Peripheral players (5-15% exposure)",
        "Primary game stack in 30% of lineups"
      ]
    }
  };

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="principles">Key Principles</TabsTrigger>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
            <TabsTrigger value="builds">Build Types</TabsTrigger>
            {entryType === 'single' && <TabsTrigger value="checklist">Checklist</TabsTrigger>}
            {entryType === '20-max' && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
          </TabsList>

          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <TabsContent value="principles">
              <ul className="space-y-2">
                {currentStrategy.keyPrinciples.map((principle, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    {principle}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="ownership">
              <ul className="space-y-2">
                {entryType === 'single' && currentStrategy.ownershipManagement.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    {item}
                  </li>
                ))}
                {entryType === '3-max' && currentStrategy.ownershipStructure.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    {item}
                  </li>
                ))}
                {entryType === '20-max' && currentStrategy.portfolioManagement.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="builds">
              <ul className="space-y-2">
                {entryType === 'single' && currentStrategy.rosterConstruction.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    {item}
                  </li>
                ))}
                {(entryType === '3-max' || entryType === '20-max') && currentStrategy.buildTypes.map((type, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-secondary mr-2">•</span>
                    {type}
                  </li>
                ))}
              </ul>
            </TabsContent>

            {entryType === 'single' && (
              <TabsContent value="checklist">
                <ul className="space-y-2">
                  {currentStrategy.checklist.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </TabsContent>
            )}

            {entryType === '20-max' && (
              <TabsContent value="advanced">
                <ul className="space-y-2">
                  {currentStrategy.advancedConcepts.map((concept, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      {concept}
                    </li>
                  ))}
                </ul>
              </TabsContent>
            )}
          </ScrollArea>
        </Tabs>
      </Card>
    </div>
  );
};

export default StrategyGuide;