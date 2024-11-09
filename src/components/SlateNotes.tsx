import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyzeSlate } from '@/services/slateAnalysisService';

const SlateAnalysis = () => {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none min-h-[200px] max-w-none',
      },
    },
  });

  const { data: analysisData, isLoading } = useQuery({
    queryKey: ['slateAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('slate_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      if (analysisData?.id) {
        const { data, error } = await supabase
          .from('slate_analysis')
          .update({ content })
          .eq('id', analysisData.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('slate_analysis')
          .insert({ content })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slateAnalysis'] });
      toast({
        title: "Success",
        description: "Slate analysis saved",
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

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await analyzeSlate();
      toast({
        title: "Analysis Complete",
        description: "Slate analysis has been processed and player adjustments have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['playerAdjustments'] });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze slate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (analysisData?.content && editor) {
      editor.commands.setContent(analysisData.content);
    }
  }, [analysisData, editor]);

  const handleSave = () => {
    const content = editor?.getHTML();
    if (content) {
      mutation.mutate(content);
    }
  };

  if (isLoading) {
    return <div>Loading analysis...</div>;
  }

  return (
    <Card className="p-4">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Slate Analysis</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Add your notes about the slate here - game conditions, injury impacts, expected ownership trends, or any other factors that could influence lineup building. This analysis will be used to help optimize your lineups.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              onClick={handleAnalyze}
              disabled={isAnalyzing || mutation.isPending}
              className="text-secondary-foreground"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
              Analyze Slate
            </Button>
            <Button onClick={handleSave} disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Analysis'}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">Document key insights, matchups, and trends to inform your lineup optimization</p>
      </div>

      <ScrollArea className="h-[400px] border rounded-md">
        <div className="p-4">
          <EditorContent editor={editor} />
        </div>
      </ScrollArea>
    </Card>
  );
};

export default SlateAnalysis;