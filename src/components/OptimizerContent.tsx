import { Button } from "@/components/ui/button";
import { OptimizationSettings } from '../types';
import ProjectionsUpload from './ProjectionsUpload';
import SlateNotes from './SlateNotes';
import OptimizationSettingsComponent from './OptimizationSettings';
import EntryTypeSettings from './EntryTypeSettings';
import FileUploadList from './FileUploadList';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown } from "lucide-react";

interface OptimizerContentProps {
  settings: OptimizationSettings;
  setSettings: (settings: OptimizationSettings) => void;
  isNotesOpen: boolean;
  setIsNotesOpen: (open: boolean) => void;
  fileUploads: any[];
  isLoading: boolean;
  canOptimize: boolean;
  onOptimize: () => void;
  onProjectionsUploaded: () => void;
  onRemoveFile: (fileId: string) => void;
}

const OptimizerContent = ({
  settings,
  setSettings,
  isNotesOpen,
  setIsNotesOpen,
  fileUploads,
  isLoading,
  canOptimize,
  onOptimize,
  onProjectionsUploaded,
  onRemoveFile
}: OptimizerContentProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EntryTypeSettings settings={settings} setSettings={setSettings} />
        <OptimizationSettingsComponent settings={settings} setSettings={setSettings} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Additional Analysis Notes</h3>
                <span className="text-sm text-muted-foreground">(Click to expand)</span>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-transparent">
                  <ChevronDown className={`h-4 w-4 transition-transform ${isNotesOpen ? 'transform rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                <SlateNotes />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <div className="border-2 border-secondary/20 rounded-lg p-4 bg-secondary/5">
            <ProjectionsUpload onProjectionsUploaded={onProjectionsUploaded} />
            <FileUploadList 
              fileUploads={fileUploads}
              isLoading={isLoading}
              onRemoveFile={onRemoveFile}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          size="lg"
          onClick={onOptimize}
          className="bg-secondary hover:bg-secondary/90"
          disabled={!canOptimize || isLoading}
        >
          {isLoading ? 'Generating Lineups...' : 'Generate Optimal Lineups'}
        </Button>
        {isLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : !canOptimize ? (
          <p className="text-sm text-gray-400">
            Need at least 8 valid players with non-zero salary and projected points
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default OptimizerContent;