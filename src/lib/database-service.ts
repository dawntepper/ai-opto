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
  const { error } = await supabase
    .from('players')
    .upsert(
      validData.map(transformDraftKingsData),
      { onConflict: 'partner_id' }
    );
  
  if (error) throw error;
};

export const upsertProjections = async (validData: Projection[]) => {
  const { error } = await supabase
    .from('players')
    .upsert(
      validData.map(transformProjectionsData),
      { onConflict: 'partner_id' }
    );
  
  if (error) throw error;
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