import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { EntryType, OptimizationSettings } from '../types';
import ProjectionsUpload from './ProjectionsUpload';
import SlateAnalysis from './SlateAnalysis';

interface LineupOptimizerProps {
  entryType: EntryType;
}

const LineupOptimizer = ({ entryType }: LineupOptimizerProps) => {
  const [settings, setSettings] = useState<OptimizationSettings>({
    entryType,
    maxSalary: 50000,
    minValue: 4,
    maxOwnership: getDefaultMaxOwnership(entryType),
    correlationStrength: getDefaultCorrelation(entryType),
    lineupCount: getDefaultLineupCount(entryType)
  });

  const handleOptimize = () => {
    // TODO: Implement optimization logic
    console.log('Optimizing with settings:', settings);
  };

  const handleProjectionsUploaded = (projections: any[]) => {
    // Store projections in state or context
    console.log('Projections uploaded:', projections);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-white/5">
          <h3 className="text-xl font-semibold mb-4">Optimization Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Max Salary Cap</label>
              <Slider
                value={[settings.maxSalary]}
                min={40000}
                max={50000}
                step={100}
                onValueChange={(value) => setSettings({ ...settings, maxSalary: value[0] })}
              />
              <span className="text-sm text-gray-300">${settings.maxSalary.toLocaleString()}</span>
            </div>

            <div>
              <label className="block text-sm mb-2">Max Ownership %</label>
              <Slider
                value={[settings.maxOwnership]}
                min={0}
                max={100}
                onValueChange={(value) => setSettings({ ...settings, maxOwnership: value[0] })}
              />
              <span className="text-sm text-gray-300">{settings.maxOwnership}%</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/5">
          <h3 className="text-xl font-semibold mb-4">Entry Type Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={settings.entryType === 'single' ? "default" : "outline"}
                onClick={() => setSettings({ 
                  ...settings, 
                  entryType: 'single',
                  maxOwnership: getDefaultMaxOwnership('single'),
                  correlationStrength: getDefaultCorrelation('single'),
                  lineupCount: getDefaultLineupCount('single')
                })}
                className={settings.entryType !== 'single' ? "text-primary" : ""}
              >
                Single
              </Button>
              <Button
                variant={settings.entryType === '3-max' ? "default" : "outline"}
                onClick={() => setSettings({ 
                  ...settings, 
                  entryType: '3-max',
                  maxOwnership: getDefaultMaxOwnership('3-max'),
                  correlationStrength: getDefaultCorrelation('3-max'),
                  lineupCount: getDefaultLineupCount('3-max')
                })}
                className={settings.entryType !== '3-max' ? "text-primary" : ""}
              >
                3-Max
              </Button>
              <Button
                variant={settings.entryType === '20-max' ? "default" : "outline"}
                onClick={() => setSettings({ 
                  ...settings, 
                  entryType: '20-max',
                  maxOwnership: getDefaultMaxOwnership('20-max'),
                  correlationStrength: getDefaultCorrelation('20-max'),
                  lineupCount: getDefaultLineupCount('20-max')
                })}
                className={settings.entryType !== '20-max' ? "text-primary" : ""}
              >
                20-Max
              </Button>
            </div>

            <div>
              <label className="block text-sm mb-2">Number of Lineups</label>
              <Input
                type="number"
                value={settings.lineupCount}
                onChange={(e) => {
                  const count = parseInt(e.target.value);
                  if (!isNaN(count) && count > 0) {
                    setSettings({ ...settings, lineupCount: count });
                  }
                }}
                min={1}
                max={getMaxLineups(settings.entryType)}
                className="bg-white/5"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectionsUpload onProjectionsUploaded={handleProjectionsUploaded} />
        <SlateAnalysis />
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleOptimize}
          className="bg-secondary hover:bg-secondary/90"
        >
          Generate Optimal Lineups
        </Button>
      </div>
    </div>
  );
};

// Helper functions for default values based on entry type
function getDefaultMaxOwnership(entryType: EntryType): number {
  switch (entryType) {
    case 'single': return 35;
    case '3-max': return 45;
    case '20-max': return 55;
  }
}

function getDefaultCorrelation(entryType: EntryType): 'weak' | 'medium' | 'strong' {
  switch (entryType) {
    case 'single': return 'medium';
    case '3-max': return 'medium';
    case '20-max': return 'strong';
  }
}

function getDefaultLineupCount(entryType: EntryType): number {
  switch (entryType) {
    case 'single': return 1;
    case '3-max': return 3;
    case '20-max': return 20;
  }
}

function getMaxLineups(entryType: EntryType): number {
  switch (entryType) {
    case 'single': return 1;
    case '3-max': return 3;
    case '20-max': return 20;
  }
}

export default LineupOptimizer;