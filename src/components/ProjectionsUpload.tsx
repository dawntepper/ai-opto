import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { read, utils } from 'xlsx';
import { Card } from './ui/card';
import { toast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { processDraftKingsTemplate } from '@/lib/process-draftkings';
import { processProjections } from '@/lib/process-projections';

interface ProjectionsUploadProps {
  onProjectionsUploaded: (projections: any[]) => void;
}

const ProjectionsUpload = ({ onProjectionsUploaded }: ProjectionsUploadProps) => {
  const processFile = async (data: any[], fileName: string) => {
    try {
      let processedData;
      if (fileName.toLowerCase().includes('draftkings')) {
        processedData = processDraftKingsTemplate(data);
        
        // Insert into players table
        const { error } = await supabase.from('players').upsert(
          processedData.map(player => ({
            name: player.Name,
            position: player.Position,
            salary: player.Salary,
            team: player.TeamAbbrev,
            opponent: extractGameInfo(player.GameInfo).awayTeam,
            partner_id: player.ID,
            projected_points: player.AvgPointsPerGame,
            status: 'available',
            roster_positions: player.RosterPosition
          })),
          { onConflict: 'partner_id' }
        );

        if (error) throw error;
        toast({
          title: "Success",
          description: "DraftKings template processed successfully",
        });
      } else {
        processedData = processProjections(data);
        
        // Update players with projections
        const { error } = await supabase.from('players').upsert(
          processedData.map(proj => ({
            partner_id: proj.partner_id,
            projected_points: proj.fpts,
            ownership: proj.proj_own,
            ceiling: proj.ceil,
            floor: proj.floor,
            minutes: proj.minutes,
            rg_id: proj.rg_id
          })),
          { onConflict: 'partner_id' }
        );

        if (error) throw error;
        toast({
          title: "Success",
          description: "Projections processed successfully",
        });
      }
      
      onProjectionsUploaded(processedData);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive",
      });
    }
  };

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
        
        processFile(jsonData, file.name);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse file",
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
        <p className="text-center">Drag & drop DraftKings template or projections file here</p>
      )}
      <p className="text-center text-sm text-muted-foreground mt-2">
        Supports CSV and Excel files
      </p>
    </Card>
  );
};

export default ProjectionsUpload;