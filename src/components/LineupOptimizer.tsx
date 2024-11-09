import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { EntryType, OptimizationSettings } from '../types';
import ProjectionsUpload from './ProjectionsUpload';
import SlateAnalysis from './SlateAnalysis';
import { toast } from "./ui/use-toast";
import OptimizationSettingsComponent from './OptimizationSettings';
import EntryTypeSettings from './EntryTypeSettings';
import { getDefaultMaxOwnership, getDefaultCorrelation, getDefaultLineupCount } from '../utils/optimizationDefaults';
import { X } from 'lucide-react';

interface LineupOptimizerProps {
  entryType: EntryType;
}

interface UploadedFile {
  name: string;
  type: 'draftkings' | 'projections';
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

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleOptimize = () => {
    if (uploadedFiles.length < 2) {
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
    const fileType = fileName.toLowerCase().includes('draftkings') ? 'draftkings' : 'projections';
    
    // Check if we already have a file of this type
    const existingFileIndex = uploadedFiles.findIndex(f => f.type === fileType);
    if (existingFileIndex !== -1) {
      // Replace the existing file
      const newFiles = [...uploadedFiles];
      newFiles[existingFileIndex] = { name: fileName, type: fileType };
      setUploadedFiles(newFiles);
    } else {
      // Add new file
      setUploadedFiles([...uploadedFiles, { name: fileName, type: fileType }]);
    }

    toast({
      title: fileType === 'draftkings' ? "DraftKings Template Uploaded" : "Projections Uploaded",
      description: "File processed successfully"
    });
  };

  const removeFile = (type: 'draftkings' | 'projections') => {
    setUploadedFiles(uploadedFiles.filter(f => f.type !== type));
  };

  const hasDraftKingsTemplate = uploadedFiles.some(f => f.type === 'draftkings');
  const hasProjections = uploadedFiles.some(f => f.type === 'projections');

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
            <ul className="list-none space-y-2 ml-2">
              <li className="flex items-center justify-between">
                <span className={hasDraftKingsTemplate ? "text-green-500" : ""}>
                  DraftKings contest template (.csv)
                </span>
                {hasDraftKingsTemplate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeFile('draftkings')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </li>
              <li className="flex items-center justify-between">
                <span className={hasProjections ? "text-green-500" : ""}>
                  Projections file with matching player IDs (.csv)
                </span>
                {hasProjections && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeFile('projections')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
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