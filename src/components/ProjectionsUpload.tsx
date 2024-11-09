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
      
      // First, record the file upload and get the ID
      const { data: fileUpload, error: uploadError } = await supabase
        .from('file_uploads')
        .insert({
          filename: fileName,
          file_type: fileType,
          processed: false
        })
        .select()
        .single();

      if (uploadError) {
        console.error('Error recording file upload:', uploadError);
        throw uploadError;
      }

      console.log('File upload recorded:', fileUpload);

      let processedData;
      if (fileType === 'draftkings') {
        processedData = processDraftKingsTemplate(data);
        
        const validData = processedData.filter(player => player.ID);
        console.log('Processing DraftKings data:', validData.length, 'valid players');
        
        // First, mark all existing players as unavailable
        const { error: updateError } = await supabase
          .from('players')
          .update({ status: 'unavailable' })
          .neq('status', 'out');  // Don't update players already marked as 'out'
        
        if (updateError) {
          console.error('Error updating player statuses:', updateError);
          throw updateError;
        }

        // Then insert/update new players as available
        const { error } = await supabase
          .from('players')
          .upsert(
            validData.map(player => ({
              name: player.Name,
              position: player.Position,
              salary: player.Salary,
              team: player.TeamAbbrev,
              opponent: extractGameInfo(player.GameInfo).awayTeam,
              partner_id: player.ID,
              projected_points: player.AvgPointsPerGame || 0,
              ownership: 0, // Default ownership
              status: 'available', // Mark new/updated players as available
              roster_positions: player.RosterPosition
            })),
            { onConflict: 'partner_id' }
          );

        if (error) {
          console.error('Error upserting DraftKings data:', error);
          throw error;
        }
      } else {
        processedData = processProjections(data);
        
        const validData = processedData.filter(proj => proj.partner_id);
        console.log('Processing projections data:', validData.length, 'valid projections');
        
        const { error } = await supabase
          .from('players')
          .upsert(
            validData.map(proj => ({
              partner_id: proj.partner_id,
              projected_points: proj.fpts || 0,
              ownership: proj.proj_own || 0,
              ceiling: proj.ceil,
              floor: proj.floor,
              minutes: proj.minutes,
              rg_id: proj.rg_id,
              status: 'available' // Ensure players are marked as available
            })), 
            { onConflict: 'partner_id' }
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
        .eq('id', fileUpload.id);

      if (updateError) {
        console.error('Error updating file status:', updateError);
        throw updateError;
      }

      toast({
        title: "Success",
        description: `File ${fileName} processed successfully`,
      });
      
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