import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./ui/use-toast";
import { Info, Upload, Sun, ChevronDown } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface SlateNotesProps {
  defaultOpen?: boolean;
}

const SlateNotes = ({ defaultOpen = false }: SlateNotesProps) => {
  const [notes, setNotes] = useState("");
  const [isOpen, setIsOpen] = useState(defaultOpen);
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="p-6 bg-black/40 backdrop-blur-sm rounded-lg border border-green-900/30">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-green-400" />
            <h3 className="text-xl font-semibold text-green-50">Slate Analysis</h3>
          </div>
          <ChevronDown className={`h-4 w-4 text-green-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4">
          <div className="flex items-center gap-2 text-sm text-green-300/80 mb-2">
            <Info className="h-4 w-4" />
            <p>Add notes about injuries, weather conditions, or any other factors that might affect player performance.</p>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 mb-4 cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-green-400 bg-green-900/20' 
                : 'border-green-800 hover:border-green-600 bg-black/20'}`}
          >
            <input {...getInputProps()} />
            <div className="flex items-center justify-center gap-2 text-sm text-green-300/80">
              <Upload className="h-4 w-4" />
              <p>{isDragActive ? "Drop the file here" : "Drag & drop a CSV/TXT file, or click to import analysis data"}</p>
            </div>
          </div>

          <Textarea
            placeholder="Example: John Smith (questionable) expected to play limited minutes. Weather forecast shows heavy rain in Chicago..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] bg-black/20 text-green-50 border-green-900/30 placeholder:text-green-700"
          />
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={!notes.trim() || saveMutation.isPending}
              className="bg-green-700 hover:bg-green-600 text-green-50"
            >
              Save Analysis Notes
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default SlateNotes;