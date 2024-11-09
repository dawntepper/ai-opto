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
import { ScrollArea } from './ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
    maxOwnership: getDefaultMaxOwnership(entryType),
    correlationStrength: getDefaultCorrelation(entryType),
    lineupCount: getDefaultLineupCount(entryType)
  });

  const { data: fileUploads, refetch, isLoading } = useQuery({
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

  // Check if we have both required file types
  const hasDraftKings = fileUploads?.some(file => file.file_type === 'draftkings' && file.processed);
  const hasProjections = fileUploads?.some(file => file.file_type === 'projections' && file.processed);
  const canOptimize = hasDraftKings && hasProjections;

  const handleOptimize = () => {
    if (!canOptimize) {
      toast({
        title: "Missing Required Files",
        description: "Please upload both the DraftKings template and projections before generating lineups.",
        variant: "destructive"
      });
      return;
    }
    console.log('Optimizing with settings:', settings);
  };

  const handleProjectionsUploaded = async (projections: any[], fileName: string) => {
    const fileType = fileName.toLowerCase().includes('draftkings') ? 'draftkings' : 'projections';
    
    toast({
      title: fileType === 'draftkings' ? "DraftKings Template Uploaded" : "Projections Uploaded",
      description: "File processed successfully"
    });
    
    await refetch();
  };

  const removeFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('file_uploads')
        .delete()
        .eq('id', fileId);
      
      if (error) throw error;
      
      await refetch();
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EntryTypeSettings settings={settings} setSettings={setSettings} />
        <OptimizationSettingsComponent settings={settings} setSettings={setSettings} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ProjectionsUpload onProjectionsUploaded={handleProjectionsUploaded} />
          
          {fileUploads && fileUploads.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
              <ScrollArea className="h-[100px] border rounded-md">
                <div className="p-2">
                  {fileUploads.map((file) => (
                    <div key={file.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{file.filename}</span>
                        {!file.processed && (
                          <span className="text-xs text-yellow-500">(Processing...)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {new Date(file.created_at!).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
        <SlateAnalysis />
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          size="lg"
          onClick={handleOptimize}
          className="bg-secondary hover:bg-secondary/90"
          disabled={!canOptimize}
        >
          Generate Optimal Lineups
        </Button>
        {!canOptimize && (
          <p className="text-sm text-gray-400">
            {isLoading ? "Loading files..." : 
             !hasDraftKings && !hasProjections ? "Please upload both the DraftKings template and projections" :
             !hasDraftKings ? "Please upload the DraftKings template" :
             "Please upload the projections file"}
          </p>
        )}
      </div>
    </div>
  );
};

export default LineupOptimizer;