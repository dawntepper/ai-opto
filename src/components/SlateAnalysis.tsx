import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useEffect } from 'react';

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

  useEffect(() => {
    const savedContent = localStorage.getItem('slateAnalysis');
    if (savedContent && editor) {
      editor.commands.setContent(savedContent);
    }
  }, [editor]);

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
    </Card>
  );
};

export default SlateAnalysis;