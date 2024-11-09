import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { EntryType, OptimizationSettings } from '../types';
import ProjectionsUpload from './ProjectionsUpload';
import SlateNotes from './SlateNotes';
import { toast } from "./ui/use-toast";
import OptimizationSettingsComponent from './OptimizationSettings';
import EntryTypeSettings from './EntryTypeSettings';
import { getDefaultMaxOwnership, getDefaultCorrelation, getDefaultLineupCount } from '../utils/optimizationDefaults';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import GeneratedLineups from './GeneratedLineups';
import FileUploadList from './FileUploadList';
import { checkValidPlayers, generateLineups, saveOptimizationSettings } from '../services/lineupService';
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown } from "lucide-react";

interface LineupOptimizerProps {
  entryType: EntryType;
}

const LineupOptimizer = ({ entryType }: LineupOptimizerProps) => {
  const queryClient = useQueryClient();
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [settings, setSettings] = useState<OptimizationSettings>({
    entryType,
    maxSalary: 50000,
    maxOwnership: getDefaultMaxOwnership(entryType),
    correlationStrength: getDefaultCorrelation(entryType),
    lineupCount: getDefaultLineupCount(entryType)
  });

  const [showLineups, setShowLineups] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const { data: validPlayersCount, isLoading: playersLoading } = useQuery({
    queryKey: ['validPlayers'],
    queryFn: checkValidPlayers
  });

  const { data: fileUploads, refetch, isLoading: fileUploadsLoading } = useQuery({
    queryKey: ['uploadedFiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  const canOptimize = validPlayersCount && validPlayersCount >= 8;

  const handleOptimize = async () => {
    if (!canOptimize) {
      toast({
        title: "Cannot Generate Lineups",
        description: "Please ensure you have at least 8 valid players with non-zero salary and projected points.",
        variant: "destructive"
      });
      return;
    }

    // Additional salary cap validation
    if (settings.maxSalary > 50000) {
      toast({
        title: "Invalid Salary Cap",
        description: "Maximum salary cap cannot exceed $50,000.",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const settingsData = await saveOptimizationSettings(settings);
      console.log('Settings saved with ID:', settingsData.id);
      
      const lineups = await generateLineups(settingsData.id);
      console.log('Lineups generated:', lineups);

      if (!lineups || lineups.length === 0) {
        throw new Error('No valid lineups could be generated');
      }

      await queryClient.invalidateQueries({ queryKey: ['lineups'] });

      toast({
        title: "Success",
        description: `Successfully generated ${lineups.length} lineup${lineups.length > 1 ? 's' : ''}.`
      });

      setShowLineups(true);
    } catch (error: any) {
      console.error('Optimization error:', error);
      const errorMessage = error.message || "Failed to generate lineups";
      const details = error.details || "";
      
      toast({
        title: "Error Generating Lineups",
        description: `${errorMessage}${details ? `: ${details}` : ''}`,
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleProjectionsUploaded = async () => {
    await refetch();
    await queryClient.invalidateQueries({ queryKey: ['validPlayers'] });
    toast({
      title: "Files Processed",
      description: "Projections have been processed successfully"
    });
  };

  const removeFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('file_uploads')
        .delete()
        .eq('id', fileId);
      
      if (error) throw error;
      
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ['validPlayers'] });
      toast({
        title: "File Removed",
        description: "File has been removed successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove file",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    setShowLineups(false);
    queryClient.invalidateQueries({ queryKey: ['lineups'] });
  };

  const isLoading = fileUploadsLoading || playersLoading || isOptimizing;

  if (showLineups) {
    return <GeneratedLineups onBack={handleBack} />;
  }

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
              <h3 className="text-lg font-semibold">Slate Notes</h3>
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
            <ProjectionsUpload onProjectionsUploaded={handleProjectionsUploaded} />
            <FileUploadList 
              fileUploads={fileUploads}
              isLoading={isLoading}
              onRemoveFile={removeFile}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          size="lg"
          onClick={handleOptimize}
          className="bg-secondary hover:bg-secondary/90"
          disabled={!canOptimize || isLoading}
        >
          {isOptimizing ? 'Generating Lineups...' : 'Generate Optimal Lineups'}
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

export default LineupOptimizer;