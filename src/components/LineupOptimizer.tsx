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
import { validateSettings, getValidPlayersStats } from '../services/optimizationService';
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import OptimizerContent from './OptimizerContent';

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

    setIsOptimizing(true);
    try {
      // Validate settings
      validateSettings(settings);

      // Get player stats for better error messages
      const playerStats = await getValidPlayersStats();
      console.log('Player stats:', playerStats.stats);

      const settingsData = await saveOptimizationSettings(settings);
      console.log('Settings saved with ID:', settingsData.id);
      
      const lineups = await generateLineups(settingsData.id);
      console.log('Lineups generated:', lineups);

      if (!lineups || lineups.length === 0) {
        throw new Error('No valid lineups could be generated. ' + playerStats.stats);
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
      
      toast({
        title: "Error Generating Lineups",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  if (showLineups) {
    return <GeneratedLineups onBack={() => setShowLineups(false)} />;
  }

  return <OptimizerContent 
    settings={settings}
    setSettings={setSettings}
    isNotesOpen={isNotesOpen}
    setIsNotesOpen={setIsNotesOpen}
    fileUploads={fileUploads}
    isLoading={fileUploadsLoading || playersLoading || isOptimizing}
    canOptimize={canOptimize}
    onOptimize={handleOptimize}
    onProjectionsUploaded={async () => {
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ['validPlayers'] });
      toast({
        title: "Files Processed",
        description: "Projections have been processed successfully"
      });
    }}
    onRemoveFile={async (fileId: string) => {
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
    }}
  />;
};

export default LineupOptimizer;