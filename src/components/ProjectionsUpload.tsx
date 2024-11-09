import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { toast } from "./ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface ProjectionsUploadProps {
  onProjectionsUploaded: () => void;
}

const ProjectionsUpload = ({ onProjectionsUploaded }: ProjectionsUploadProps) => {
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

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Upload Projections</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="font-semibold mb-2">Required CSV Headers:</p>
                <ul className="text-sm list-disc pl-4">
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
                <p className="mt-2 text-xs">You can use any projections source as long as your CSV matches these headers.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">
          {isDragActive
            ? "Drop the file here"
            : "Drag & drop your projections file, or click to select"}
        </p>
        <p className="text-xs text-gray-400 mt-1">Accepts CSV, XLS, XLSX</p>
      </div>
    </Card>
  );
};

export default ProjectionsUpload;