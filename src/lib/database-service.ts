import { supabase } from '@/integrations/supabase/client';
import { DraftKingsPlayer, Projection, transformDraftKingsData, transformProjectionsData } from './data-transformers';

export const markExistingPlayersUnavailable = async () => {
  const { error } = await supabase
    .from('players')
    .update({ status: 'unavailable' })
    .neq('status', 'out');
  
  if (error) throw error;
};

export const upsertDraftKingsPlayers = async (validData: DraftKingsPlayer[]) => {
  // Transform and insert new data
  const transformedData = validData.map(transformDraftKingsData);
  console.log('Upserting DraftKings players:', transformedData);

  const { error } = await supabase
    .from('players')
    .upsert(transformedData, { 
      onConflict: 'partner_id',
      ignoreDuplicates: false 
    });
  
  if (error) {
    console.error('Error upserting DraftKings players:', error);
    throw error;
  }
};

export const upsertProjections = async (validData: Projection[]) => {
  // Transform the data
  const transformedData = validData.map(transformProjectionsData);
  console.log('Upserting projections:', transformedData);

  // Get existing players to preserve salary data
  const { data: existingPlayers, error: fetchError } = await supabase
    .from('players')
    .select('partner_id, salary')
    .in('partner_id', transformedData.map(p => p.partner_id));

  if (fetchError) throw fetchError;

  // Merge with existing salary data and ensure status is 'available'
  const mergedData = transformedData.map(player => {
    const existing = existingPlayers?.find(ep => ep.partner_id === player.partner_id);
    return {
      ...player,
      salary: existing?.salary || player.salary || 0,
      status: 'available' // Ensure players are marked as available
    };
  });

  const { error } = await supabase
    .from('players')
    .upsert(mergedData, { 
      onConflict: 'partner_id',
      ignoreDuplicates: false 
    });
  
  if (error) {
    console.error('Error upserting projections:', error);
    throw error;
  }
};

export const recordFileUpload = async (fileName: string, fileType: 'draftkings' | 'projections') => {
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
  return data;
};

export const markFileProcessed = async (fileId: string) => {
  const { error } = await supabase
    .from('file_uploads')
    .update({ processed: true })
    .eq('id', fileId);

  if (error) throw error;
};