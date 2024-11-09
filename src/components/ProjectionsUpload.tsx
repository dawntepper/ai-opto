import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { read, utils } from 'xlsx';
import { Card } from './ui/card';
import { toast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { processDraftKingsTemplate, extractGameInfo } from '@/lib/process-draftkings';
import { processProjections } from '@/lib/process-projections';

interface ProjectionsUploadProps {
  onProjectionsUploaded: (projections: any[], fileName: string) => void;
}

const ProjectionsUpload = ({ onProjectionsUploaded }: ProjectionsUploadProps) => {
  const processFile = async (data: any[], fileName: string) => {
    try {
      const fileType = fileName.toLowerCase().includes('draftkings') ? 'draftkings' : 'projections';
      
      // First, record the file upload
      const { error: uploadError } = await supabase.from('file_uploads').insert({
        filename: fileName,
        file_type: fileType,
        processed: false
      });

      if (uploadError) {
        console.error('Error recording file upload:', uploadError);
        throw uploadError;
      }

      let processedData;
      if (fileType === 'draftkings') {
        processedData = processDraftKingsTemplate(data);
        
        const validData = processedData.filter(player => player.ID);
        
        const { error } = await supabase.from('players').upsert(
          validData.map(player => ({
            name: player.Name,
            position: player.Position,
            salary: player.Salary,
            team: player.TeamAbbrev,
            opponent: extractGameInfo(player.GameInfo).awayTeam,
            partner_id: player.ID,
            projected_points: player.AvgPointsPerGame,
            status: 'available',
            roster_positions: player.RosterPosition
          }))
        );

        if (error) {
          console.error('Error upserting DraftKings data:', error);
          throw error;
        }
      } else {
        processedData = processProjections(data);
        
        const validData = processedData.filter(proj => proj.partner_id);
        
        const { error } = await supabase.from('players').upsert(
          validData.map(proj => ({
            partner_id: proj.partner_id,
            projected_points: proj.fpts,
            ownership: proj.proj_own,
            ceiling: proj.ceil,
            floor: proj.floor,
            minutes: proj.minutes,
            rg_id: proj.rg_id
          }))
        );

        if (error) {
          console.error('Error upserting projections:', error);
          throw error;
        }
      }
      
      // Mark the file as processed
      const { error: updateError } = await supabase
        .from('file_uploads')
        .update({ processed: true })
        .eq('filename', fileName);

      if (updateError) {
        console.error('Error updating file status:', updateError);
      }
      
      onProjectionsUploaded(processedData, fileName);
    } catch (error) {
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