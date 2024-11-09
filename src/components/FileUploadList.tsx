import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface FileUploadListProps {
  fileUploads: any[] | null;
  isLoading: boolean;
  onRemoveFile: (fileId: string) => void;
}

const FileUploadList = ({ fileUploads, isLoading, onRemoveFile }: FileUploadListProps) => {
  if (isLoading) return <div>Loading files...</div>;
  if (!fileUploads?.length) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
      <ScrollArea className="h-[100px] border rounded-md">
        <div className="p-2">
          {fileUploads.map((file) => (
            <div key={file.id} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">{file.filename}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {new Date(file.created_at!).toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onRemoveFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FileUploadList;