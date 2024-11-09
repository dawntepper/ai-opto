import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { read, utils } from 'xlsx';
import { Card } from './ui/card';
import { toast } from './ui/use-toast';

interface ProjectionsUpload {
  onProjectionsUploaded: (projections: any[]) => void;
}

const ProjectionsUpload = ({ onProjectionsUploaded }: ProjectionsUpload) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json(worksheet);
        
        onProjectionsUploaded(jsonData);
        toast({
          title: "Success",
          description: "Projections uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse projections file",
          variant: "destructive",
        });
      }
    };

    reader.readAsBinaryString(file);
  }, [onProjectionsUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <Card
      {...getRootProps()}
      className="p-6 border-dashed border-2 cursor-pointer hover:border-primary transition-colors"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-center text-primary">Drop the file here...</p>
      ) : (
        <p className="text-center">Drag & drop projections file here, or click to select</p>
      )}
      <p className="text-center text-sm text-muted-foreground mt-2">
        Supports CSV and Excel files
      </p>
    </Card>
  );
};

export default ProjectionsUpload;