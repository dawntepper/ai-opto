import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { read, utils } from 'xlsx';
import { Card } from './ui/card';
import { toast } from './ui/use-toast';
import { processDraftKingsTemplate } from '@/lib/process-draftkings';
import { processProjections } from '@/lib/process-projections';
import { 
  markExistingPlayersUnavailable, 
  upsertDraftKingsPlayers, 
  upsertProjections,
  recordFileUpload,
  markFileProcessed
} from '@/lib/database-service';

interface ProjectionsUploadProps {
  onProjectionsUploaded: () => void;
}

const ProjectionsUpload = ({ onProjectionsUploaded }: ProjectionsUploadProps) => {
  const processFile = async (data: any[], fileName: string) => {
    try {
      const fileType = fileName.toLowerCase().includes('draftkings') ? 'draftkings' : 'projections';
      
      // Record the file upload
      const fileUpload = await recordFileUpload(fileName, fileType);
      console.log('File upload recorded:', fileUpload);

      if (fileType === 'draftkings') {
        const processedData = processDraftKingsTemplate(data);
        const validData = processedData.filter(player => player.ID);
        console.log('Processing DraftKings data:', validData.length, 'valid players');
        
        await markExistingPlayersUnavailable();
        await upsertDraftKingsPlayers(validData);
      } else {
        const processedData = processProjections(data);
        const validData = processedData.filter(proj => proj.partner_id);
        console.log('Processing projections data:', validData.length, 'valid projections');
        
        await upsertProjections(validData);
      }
      
      await markFileProcessed(fileUpload.id);

      toast({
        title: "Success",
        description: `File ${fileName} processed successfully`,
      });
      
      onProjectionsUploaded();
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "Failed to process file. Please ensure the file format is correct and try again.",
        variant: "destructive",
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      toast({
        title: "Warning",
        description: "Please upload only one file at a time.",
        variant: "destructive",
      });
      return;
    }

    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json(worksheet);
        
        processFile(jsonData, file.name);
      } catch (error) {
        console.error('Error parsing file:', error);
        toast({
          title: "Error",
          description: "Failed to parse file. Please ensure it's a valid Excel or CSV file.",
          variant: "destructive",
        });
      }
    };

    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className="p-6 border-dashed border-2 cursor-pointer hover:border-primary transition-colors"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center text-primary">Drop the file here...</p>
        ) : (
          <p className="text-center">Drop a single file here or click to browse</p>
        )}
        <p className="text-center text-sm text-muted-foreground mt-2">
          Upload one file at a time: CSV or Excel format
        </p>
      </Card>

      <div className="text-sm text-gray-300">
        <p>Required files (upload one at a time):</p>
        <ul className="list-disc list-inside ml-2">
          <li>DraftKings contest template (.csv)</li>
          <li>Projections file with matching player IDs (.csv)</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectionsUpload;