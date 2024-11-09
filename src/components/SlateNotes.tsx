import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./ui/use-toast";
import { Info, Upload, Sun } from "lucide-react";
import { useDropzone } from 'react-dropzone';

const SlateNotes = () => {
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  const { data: latestAnalysis } = useQuery({
    queryKey: ['slateAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('slate_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('slate_analysis')
        .insert([{ content }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slateAnalysis'] });
      toast({
        title: "Notes Saved",
        description: "Your slate analysis has been saved successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save slate analysis",
        variant: "destructive"
      });
    }
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const text = reader.result as string;
      try {
        const { data, error } = await supabase
          .from('file_uploads')
          .insert([{ 
            filename: file.name,
            file_type: 'analysis',
            content: text 
          }]);

        if (error) throw error;

        setNotes(prev => {
          const newContent = `${prev}\n\nImported from ${file.name}:\n${text}`;
          return newContent.trim();
        });

        toast({
          title: "Analysis File Uploaded",
          description: `Successfully imported content from ${file.name}`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to upload analysis file: ${error.message}`,
          variant: "destructive"
        });
      }
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const handleSave = () => {
    if (notes.trim()) {
      saveMutation.mutate(notes);
    }
  };

  return (
    <div className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-lg border-2 border-green-200 dark:border-green-900">
      <div className="flex items-center gap-2 mb-4">
        <Sun className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Slate Analysis</h3>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
        <Info className="h-4 w-4" />
        <p>Add notes about injuries, weather conditions, or any other factors that might affect player performance.</p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 mb-4 cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
            : 'border-gray-300 hover:border-green-500 dark:border-gray-600 dark:hover:border-green-500'}`}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Upload className="h-4 w-4" />
          <p>{isDragActive ? "Drop the file here" : "Drag & drop a CSV/TXT file, or click to import analysis data"}</p>
        </div>
      </div>

      <Textarea
        placeholder="Example: John Smith (questionable) expected to play limited minutes. Weather forecast shows heavy rain in Chicago..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[100px] bg-white dark:bg-slate-700 text-gray-900 dark:text-white border-green-100 dark:border-green-800 placeholder:text-gray-500 dark:placeholder:text-gray-400"
      />
      
      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          onClick={handleSave}
          disabled={!notes.trim() || saveMutation.isPending}
          className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600 dark:text-white"
        >
          Save Analysis Notes
        </Button>
      </div>
    </div>
  );
};

export default SlateNotes;