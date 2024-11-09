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
import { supabase } from '@/integrations/supabase/client';
import GeneratedLineups from './GeneratedLineups';
import FileUploadList from './FileUploadList';

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

  // Query to check if we have valid players data
  const { data: validPlayersCount, isLoading: playersLoading } = useQuery({
    queryKey: ['validPlayers'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('players')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'available')
        .gt('salary', 0)
        .gt('projected_points', 0);
      
      if (error) throw error;
      return count || 0;
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
      const { data: settingsData, error: settingsError } = await supabase
        .from('optimization_settings')
        .insert({
          entry_type: settings.entryType,
          max_salary: settings.maxSalary,
          max_ownership: settings.maxOwnership,
          correlation_strength: settings.correlationStrength,
          lineup_count: settings.lineupCount,
          min_value: 0
        })
        .select()
        .single();

      if (settingsError) throw settingsError;

      const { data: lineups, error: lineupsError } = await supabase
        .rpc('generate_optimal_lineups', {
          settings_id: settingsData.id
        });

      if (lineupsError) throw lineupsError;

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
      console.error('Error in optimization process:', error);
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

  if (showLineups) {
    return <GeneratedLineups onBack={handleBack} />;
  }

  const isLoading = fileUploadsLoading || playersLoading;

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