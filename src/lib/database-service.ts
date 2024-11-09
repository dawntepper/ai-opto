import { supabase } from '@/integrations/supabase/client';
import { DraftKingsPlayer, Projection, transformDraftKingsData, transformProjectionsData } from './data-transformers';

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

export const upsertProjections = async (validData: Projection[]) => {
  console.log('Processing projections:', validData.length, 'projections');
  const transformedData = validData.map(transformProjectionsData);
  console.log('Transformed projections data:', transformedData);

  const { data: existingPlayers, error: fetchError } = await supabase
    .from('players')
    .select('partner_id, salary')
    .in('partner_id', transformedData.map(p => p.partner_id));

  if (fetchError) {
    console.error('Error fetching existing players:', fetchError);
    throw fetchError;
  }

  console.log('Found existing players:', existingPlayers?.length);

  const mergedData = transformedData.map(player => {
    const existing = existingPlayers?.find(ep => ep.partner_id === player.partner_id);
    if (existing) {
      console.log(`Merging data for player ${player.name} with existing salary ${existing.salary}`);
    }
    return {
      ...player,
      salary: existing?.salary || player.salary || 0,
      status: 'available'
    };
  });

  const { error, data } = await supabase
    .from('players')
    .upsert(mergedData, { 
      onConflict: 'partner_id',
      ignoreDuplicates: false 
    })
    .select();
  
  if (error) {
    console.error('Error upserting projections:', error);
    throw error;
  }

  console.log('Successfully upserted projections:', data?.length);
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