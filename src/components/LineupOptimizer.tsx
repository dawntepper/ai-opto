import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { EntryType, OptimizationSettings } from '../types';
import ProjectionsUpload from './ProjectionsUpload';
import SlateAnalysis from './SlateAnalysis';
import { toast } from "./ui/use-toast";
import OptimizationSettingsComponent from './OptimizationSettings';
import EntryTypeSettings from './EntryTypeSettings';
import { getDefaultMaxOwnership, getDefaultCorrelation, getDefaultLineupCount } from '../utils/optimizationDefaults';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import GeneratedLineups from './GeneratedLineups';
import FileUploadList from './FileUploadList';
import { checkValidPlayers, generateLineups, saveOptimizationSettings } from '../services/lineupService';
import { supabase } from "@/integrations/supabase/client";

interface LineupOptimizerProps {
  entryType: EntryType;
}

const LineupOptimizer = ({ entryType }: LineupOptimizerProps) => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<OptimizationSettings>({
    entryType,
    maxSalary: 50000,
    maxOwnership: getDefaultMaxOwnership(entryType),
    correlationStrength: getDefaultCorrelation(entryType),
    lineupCount: getDefaultLineupCount(entryType)
  });

  const [showLineups, setShowLineups] = useState(false);

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

    try {
      console.log('Attempting to save optimization settings:', settings);
      const settingsData = await saveOptimizationSettings(settings);
      console.log('Successfully saved settings with ID:', settingsData.id);
      
      console.log('Final player check count:', validPlayersCount);
      console.log('Attempting to generate lineups with settings_id:', settingsData.id);
      
      const lineups = await generateLineups(settingsData.id);

      if (!lineups || lineups.length === 0) {
        throw new Error('No valid lineups could be generated');
      }

      await queryClient.invalidateQueries({ queryKey: ['lineups'] });

      toast({
        title: "Lineups Generated",
        description: `Successfully generated ${lineups.length} lineups.`
      });

      setShowLineups(true);
    } catch (error: any) {
      console.error('Optimization error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate lineups. Please try again.",
        variant: "destructive"
      });
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

  const isLoading = fileUploadsLoading || playersLoading;

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
          <ProjectionsUpload onProjectionsUploaded={handleProjectionsUploaded} />
          <FileUploadList 
            fileUploads={fileUploads}
            isLoading={isLoading}
            onRemoveFile={removeFile}
          />
        </div>
        <SlateAnalysis />
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          size="lg"
          onClick={handleOptimize}
          className="bg-secondary hover:bg-secondary/90"
          disabled={!canOptimize || isLoading}
        >
          Generate Optimal Lineups
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