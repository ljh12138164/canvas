import { to } from 'await-to-js';
import { supabaseNote } from '../../supabase/note';
import { checkPermission } from '../workspace';

/**
 * ### 删除文件夹
 * @param param0
 * @returns
 */
export async function deleteFolder({ token, id, workspaceId, userId }: { token: string; id: string; workspaceId: string; userId: string }): Promise<boolean> {
  const [errors] = await to(checkPermission({ token, workspaceId, userId }));
  if (errors) throw new Error('权限不足');
  const { error } = await supabaseNote(token).from('folders').delete().eq('id', id).eq('workspace_id', workspaceId);
  if (error) throw new Error('服务器错误');
  return true;
}
