import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

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

  const handleSave = () => {
    const content = editor?.getHTML();
    // Save content to local storage for now
    localStorage.setItem('slateAnalysis', content || '');
    toast({
      title: "Success",
      description: "Slate analysis saved",
    });
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Slate Analysis</h3>
        <Button onClick={handleSave}>Save Analysis</Button>
      </div>
      <EditorContent editor={editor} className="min-h-[200px] border rounded-md p-4" />
    </Card>
  );
};

export default SlateAnalysis;