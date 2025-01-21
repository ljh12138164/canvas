import type { Folders, Workspace } from '../../../types/note/workspace';
import { supabaseNote } from '../../supabase/note';

/**
 * 创建白板
 * @param param0
 * @returns
 */
export const createFolder = async ({
  title,
  content,
  userId,
  inconId,
  token,
  workspaceId,
}: {
  title: string;
  userId: string;
  content: string;
  inconId: string;
  token: string;
  workspaceId: string;
}): Promise<Folders> => {
  const { data, error } = await supabaseNote(token)
    .from('folders')
    .insert({
      title,
      data: content,
      userId,
      workspaceId,
      inconId,
    })
    .select('*');
  if (error) throw new Error(error.message);

  return data[0];
};

/**
 * ## 查询白板
 * @param param
 * @returns
 */
export const getfolder = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<Folders[]> => {
  const { data, error } = await supabaseNote(token).from('folders').select('*').eq('workspaceId', id);
  if (error) throw new Error(error.message);
  return data;
};
