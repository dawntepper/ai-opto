import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { EntryType, OptimizationSettings } from '../types';
import ProjectionsUpload from './ProjectionsUpload';
import SlateAnalysis from './SlateAnalysis';
import { toast } from "./ui/use-toast";

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

  const [showSlateAnalysis, setShowSlateAnalysis] = useState(false);
  const [hasDraftKingsTemplate, setHasDraftKingsTemplate] = useState(false);
  const [hasProjections, setHasProjections] = useState(false);

  const handleOptimize = () => {
    if (!hasDraftKingsTemplate || !hasProjections) {
      toast({
        title: "Missing Required Files",
        description: "Please upload both the DraftKings template and projections before generating lineups.",
        variant: "destructive"
      });
      return;
    }
    // TODO: Implement optimization logic
    console.log('Optimizing with settings:', settings);
  };

  const handleProjectionsUploaded = (projections: any[], fileName: string) => {
    if (fileName.toLowerCase().includes('draftkings')) {
      setHasDraftKingsTemplate(true);
      toast({
        title: "DraftKings Template Uploaded",
        description: "Template processed successfully"
      });
    } else {
      setHasProjections(true);
      toast({
        title: "Projections Uploaded",
        description: "Projections processed successfully"
      });
    }
    setShowSlateAnalysis(true);
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
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm">Max Ownership %</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum allowed projected ownership percentage for any player in your lineups. Adjust based on contest type - lower for GPPs, higher for cash games.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                value={[settings.maxOwnership]}
                min={0}
                max={100}
                onValueChange={(value) => setSettings({ ...settings, maxOwnership: value[0] })}
              />
              <span className="text-sm text-gray-300">{settings.maxOwnership}% (Default for {settings.entryType}: {getDefaultMaxOwnership(settings.entryType)}%)</span>
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
        {showSlateAnalysis && <SlateAnalysis />}
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          size="lg"
          onClick={handleOptimize}
          className="bg-secondary hover:bg-secondary/90"
          disabled={!hasDraftKingsTemplate || !hasProjections}
        >
          Generate Optimal Lineups
        </Button>
        {(!hasDraftKingsTemplate || !hasProjections) && (
          <p className="text-sm text-gray-400">
            Please upload both the DraftKings template and projections to generate lineups
          </p>
        )}
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