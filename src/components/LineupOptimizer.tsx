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

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const { data: fileUploads, refetch } = useQuery({
    queryKey: ['uploadedFiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10); // Limit to most recent uploads
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const handleOptimize = () => {
    if (uploadedFiles.length < 2) {
      toast({
        title: "Missing Required Files",
        description: "Please upload both the DraftKings template and projections before generating lineups.",
        variant: "destructive"
      });
      return;
    }
    console.log('Optimizing with settings:', settings);
  };

  const handleProjectionsUploaded = (projections: any[], fileName: string) => {
    const fileType = fileName.toLowerCase().includes('draftkings') ? 'draftkings' : 'projections';
    
    const existingFileIndex = uploadedFiles.findIndex(f => f.type === fileType);
    if (existingFileIndex !== -1) {
      const newFiles = [...uploadedFiles];
      newFiles[existingFileIndex] = { name: fileName, type: fileType };
      setUploadedFiles(newFiles);
    } else {
      setUploadedFiles([...uploadedFiles, { name: fileName, type: fileType }]);
    }

    toast({
      title: fileType === 'draftkings' ? "DraftKings Template Uploaded" : "Projections Uploaded",
      description: "File processed successfully"
    });
    
    refetch();
  };

  const removeFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('file_uploads')
        .delete()
        .eq('id', fileId);
      
      if (error) throw error;
      
      refetch();
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
                      <span className="text-sm">{file.filename}</span>
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
          disabled={!fileUploads || fileUploads.length < 2}
        >
          Generate Optimal Lineups
        </Button>
        {(!fileUploads || fileUploads.length < 2) && (
          <p className="text-sm text-gray-400">
            Please upload both the DraftKings template and projections to generate lineups
          </p>
        )}
      </div>
    </div>
  );
};

export default LineupOptimizer;
