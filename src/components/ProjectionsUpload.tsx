import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Upload, HelpCircle } from "lucide-react";
import { toast } from "./ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectionsUploadProps {
  onProjectionsUploaded: () => void;
  sport?: 'nba' | 'nfl';
}

const ProjectionsUpload = ({ onProjectionsUploaded, sport = 'nba' }: ProjectionsUploadProps) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const text = reader.result as string;

      const { data, error } = await supabase
        .from('file_uploads')
        .insert([{ 
          filename: file.name,
          file_type: 'projections',
          content: text 
        }]);

      if (error) {
        toast({
          title: "Error uploading projections",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Projections uploaded successfully!",
        description: `Uploaded ${file.name}`,
      });

      onProjectionsUploaded();
    };

    reader.readAsText(file);
  }, [onProjectionsUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  const getNFLHeaders = () => (
    <ul className="text-sm text-gray-300 list-disc pl-4">
      <li>partner_id - Unique identifier from DraftKings</li>
      <li>name - Player name</li>
      <li>position - QB, RB, WR, TE, DST</li>
      <li>salary - DraftKings salary</li>
      <li>team - Team abbreviation</li>
      <li>opp - Opponent team</li>
      <li>fpts - Projected fantasy points</li>
      <li>proj_own - Projected ownership %</li>
      <li>snap_count - Snap count (optional)</li>
      <li>target_share - Target share % (optional)</li>
      <li>rush_share - Rush share % (optional)</li>
    </ul>
  );

  const getNBAHeaders = () => (
    <ul className="text-sm text-gray-300 list-disc pl-4">
      <li>partner_id - Unique identifier</li>
      <li>name - Player name</li>
      <li>fpts - Projected fantasy points</li>
      <li>proj_own - Projected ownership %</li>
      <li>team - Team abbreviation</li>
      <li>opp - Opponent team</li>
      <li>pos - Position</li>
      <li>salary - Player salary</li>
      <li>Optional: ceil, floor, minutes</li>
    </ul>
  );

  return (
    <div className="bg-black/90 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-white">Upload {sport.toUpperCase()} Projections</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm bg-zinc-900 border-zinc-800">
                <p className="font-medium text-white mb-2">Required CSV Headers:</p>
                {sport === 'nfl' ? getNFLHeaders() : getNBAHeaders()}
                <p className="mt-2 text-xs text-gray-400">
                  You can use any projections source as long as your CSV matches these headers.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">
        Click or drag & drop to upload your {sport.toUpperCase()} projections file.
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-green-500 bg-green-500/10' 
            : 'border-zinc-700 hover:border-green-500 hover:bg-green-500/5'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className={`mx-auto h-8 w-8 mb-2 ${isDragActive ? 'text-green-500' : 'text-gray-500'}`} />
        <p className="text-sm text-gray-300">
          {isDragActive
            ? "Drop the file here"
            : "Drag & drop your projections file, or click to select"}
        </p>
        <p className="text-xs text-gray-500 mt-1">Accepts CSV, XLS, XLSX</p>
      </div>
    </div>
  );
};

export default ProjectionsUpload;