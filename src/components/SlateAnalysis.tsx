import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SlateAnalysis = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none min-h-[200px] max-w-none',
      },
    },
  });

  const { data: uploadedFiles } = useQuery({
    queryKey: ['uploadedFiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleSave = () => {
    const content = editor?.getHTML();
    localStorage.setItem('slateAnalysis', content || '');
    toast({
      title: "Success",
      description: "Slate analysis saved",
    });
  };

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
          <Button onClick={handleSave}>Save Analysis</Button>
        </div>
        <p className="text-sm text-gray-400 mt-2">Document key insights, matchups, and trends to inform your lineup optimization</p>
      </div>

      <ScrollArea className="h-[400px] border rounded-md">
        <div className="p-4">
          <EditorContent editor={editor} />
        </div>
      </ScrollArea>

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
        <ScrollArea className="h-[100px] border rounded-md">
          <div className="p-2">
            {uploadedFiles?.map((file) => (
              <div key={file.id} className="flex items-center justify-between py-1">
                <span className="text-sm">{file.filename}</span>
                <span className="text-xs text-gray-400">
                  {new Date(file.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {!uploadedFiles?.length && (
              <p className="text-sm text-gray-400 p-2">No files uploaded yet</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default SlateAnalysis;