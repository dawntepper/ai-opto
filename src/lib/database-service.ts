import { supabase } from '@/integrations/supabase/client';
import { DraftKingsPlayer, EnhancedProjection, transformDraftKingsData, transformEnhancedProjections } from './data-transformers';

export const markExistingPlayersUnavailable = async () => {
  console.log('Marking existing players as unavailable...');
  const { error, count } = await supabase
    .from('players')
    .update({ status: 'unavailable' })
    .neq('status', 'out');
  
  if (error) throw error;
  console.log(`Marked ${count} players as unavailable`);
};

export const upsertDraftKingsPlayers = async (validData: DraftKingsPlayer[]) => {
  console.log('Processing DraftKings players:', validData.length, 'players');
  const transformedData = validData.map(transformDraftKingsData);
  console.log('Transformed DraftKings data:', transformedData);

  const { error, data } = await supabase
    .from('players')
    .upsert(transformedData, { 
      onConflict: 'partner_id',
      ignoreDuplicates: false 
    })
    .select();
  
  if (error) {
    console.error('Error upserting DraftKings players:', error);
    throw error;
  }

  console.log('Successfully upserted DraftKings players:', data?.length);
  return data;
};

export const upsertEnhancedProjections = async (validData: EnhancedProjection[], positionData?: { [key: string]: string }) => {
  console.log('Processing enhanced projections:', validData.length, 'projections');
  const transformedData = validData.map(proj => transformEnhancedProjections(proj, positionData));
  console.log('Transformed projections data:', transformedData);

  const { data: existingPlayers, error: fetchError } = await supabase
    .from('players')
    .select('name, position')
    .in('name', transformedData.map(p => p.name));

  if (fetchError) {
    console.error('Error fetching existing players:', fetchError);
    throw fetchError;
  }

  console.log('Found existing players:', existingPlayers?.length);

  const mergedData = transformedData.map(player => {
    const existing = existingPlayers?.find(ep => ep.name === player.name);
    return {
      ...player,
      position: existing?.position || player.position,
      status: 'available'
    };
  });

  const { error, data } = await supabase
    .from('players')
    .upsert(mergedData, { 
      onConflict: 'name',
      ignoreDuplicates: false 
    })
    .select();
  
  if (error) {
    console.error('Error upserting enhanced projections:', error);
    throw error;
  }

  console.log('Successfully upserted enhanced projections:', data?.length);
  return data;
};

export const recordFileUpload = async (fileName: string, fileType: 'draftkings' | 'projections') => {
  console.log('Recording file upload:', fileName, fileType);
  const { data, error } = await supabase
    .from('file_uploads')
    .insert({
      filename: fileName,
      file_type: fileType,
      processed: false
    })
    .select()
    .single();

  if (error) throw error;
  console.log('File upload recorded:', data);
  return data;
};

export const markFileProcessed = async (fileId: string) => {
  console.log('Marking file as processed:', fileId);
  const { error } = await supabase
    .from('file_uploads')
    .update({ processed: true })
    .eq('id', fileId);

  if (error) throw error;
  console.log('File marked as processed');
};
