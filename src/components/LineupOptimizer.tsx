import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { EntryType, OptimizationSettings } from '../types';
import ProjectionsUpload from './ProjectionsUpload';
import SlateAnalysis from './SlateAnalysis';
import { toast } from "./ui/use-toast";
import OptimizationSettingsComponent from './OptimizationSettings';
import EntryTypeSettings from './EntryTypeSettings';
import { getDefaultMaxOwnership, getDefaultCorrelation, getDefaultLineupCount } from '../utils/optimizationDefaults';

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
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EntryTypeSettings settings={settings} setSettings={setSettings} />
        <OptimizationSettingsComponent settings={settings} setSettings={setSettings} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ProjectionsUpload onProjectionsUploaded={handleProjectionsUploaded} />
          <div className="text-sm text-gray-300">
            <p>Upload status:</p>
            <ul className="list-disc list-inside ml-2">
              <li className={hasDraftKingsTemplate ? "text-green-500" : ""}>
                DraftKings contest template (.csv)
              </li>
              <li className={hasProjections ? "text-green-500" : ""}>
                Projections file with matching player IDs (.csv)
              </li>
            </ul>
          </div>
        </div>
        <SlateAnalysis />
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

export default LineupOptimizer;