import { supabaseNoteWebhook } from '../../supabase/note/index';

/**
 * @param document 文档
 * @param documentName 文档名称
 */
export const saveDocument = async ({
  document,
  workspaceId,
  folderId,
  fileId,
}: {
  document: any;
  workspaceId: string;
  folderId: string;
  fileId: string | undefined;
}) => {
  let supabase;
  if (fileId) {
    supabase = supabaseNoteWebhook
      .from('files')
      .update([
        {
          data: document,
          updated_at: new Date().toISOString(),
        },
      ])
      .eq('id', fileId)
      .eq('foldId', folderId)
      .eq('workspaceId', workspaceId);
  } else {
    supabase = supabaseNoteWebhook
      .from('folders')
      .update({
        data: document,
        updated_at: new Date().toISOString(),
      })
      .eq('id', folderId)
      .eq('workspaceId', workspaceId);
  }
  const { data, error } = await supabase;
  console.log(error);
  if (error) throw new Error('服务器错误');
  return data;
};

/**
 * 获取文档
 */
export const getDocs = async ({
  id,
  type,
  workspaceId,
}: {
  id: string;
  type: 'file' | 'folder';
  workspaceId: string;
}): Promise<string> => {
  const { data, error } = await supabaseNoteWebhook
    .from(type === 'file' ? 'files' : 'folders')
    .select('*')
    .eq('id', id);
  if (error) throw new Error('服务器错误');
  return data[0].data;
};
