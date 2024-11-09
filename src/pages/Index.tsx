import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PlayerPool from '../components/PlayerPool';
import LineupOptimizer from '../components/LineupOptimizer';
import StrategyGuide from '../components/StrategyGuide';
import { EntryType } from '../types';

const Index = () => {
  const [entryType, setEntryType] = useState<EntryType>('single');

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/90 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold mb-2">NBA DFS Lineup Optimizer</h1>
          <p className="text-lg text-gray-200">Powered by OpenAI Predictions</p>
        </header>

        <Tabs defaultValue="optimizer" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-primary/20">
            <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
            <TabsTrigger value="pool">Player Pool</TabsTrigger>
            <TabsTrigger value="strategy">Strategy Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="optimizer">
            <Card className="bg-white/10 backdrop-blur p-6">
              <LineupOptimizer entryType={entryType} />
            </Card>
          </TabsContent>

          <TabsContent value="pool">
            <Card className="bg-white/10 backdrop-blur p-6">
              <PlayerPool />
            </Card>
          </TabsContent>

          <TabsContent value="strategy">
            <Card className="bg-white/10 backdrop-blur p-6">
              <StrategyGuide entryType={entryType} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;