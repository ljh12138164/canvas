import { to } from 'await-to-js';
import type { Folders } from '../../../types/note/workspace';
import { supabaseNote } from '../../supabase/note';
import { checkPermission } from '../workspace';

/**
 * ### 删除文件夹
 * @param param0
 * @returns
 */
export async function deleteFolderTrash({
  token,
  id,
  workspaceId,
  userId,
}: {
  token: string;
  id: string;
  workspaceId: string;
  userId: string;
}): Promise<boolean> {
  const [errors] = await to(checkPermission({ token, workspaceId, userId }));
  if (errors) throw new Error('权限不足');
  const { error } = await supabaseNote(token)
    .from('folders')
    .update({ inTrash: true })
    .eq('id', id)
    .eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return true;
}

/**
 * ### 更新文件夹
 * @param param0
 * @returns
 */
export async function updateFolder({
  token,
  id,
  title,
  inconId,
  workspaceId,
  userId,
}: {
  token: string;
  id: string;
  title: string;
  inconId: string;
  workspaceId: string;
  userId: string;
}): Promise<Folders> {
  const [errors] = await to(checkPermission({ token, workspaceId, userId }));
  if (errors) throw new Error('权限不足');
  const { data, error } = await supabaseNote(token)
    .from('folders')
    .update([{ title, inconId, created_at: new Date().toISOString() }])
    .eq('id', id)
    .eq('workspaceId', workspaceId)
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
}

/**
 * ### 删除文件夹
 * @param param0
 * @returns
 */
export async function deleteFolder({
  token,
  id,
  workspaceId,
  userId,
}: {
  token: string;
  id: string;
  workspaceId: string;
  userId: string;
}): Promise<boolean> {
  const [errors] = await to(checkPermission({ token, workspaceId, userId }));
  if (errors) throw new Error('权限不足');
  const { error } = await supabaseNote(token)
    .from('folders')
    .delete()
    .eq('id', id)
    .eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return true;
}

/**
 * ### 获取白板垃圾桶
 * @param param0
 * @returns
 */
export const getFolderTrash = async ({
  token,
  workspaceId,
  userId,
}: {
  token: string;
  workspaceId: string;
  userId: string;
}): Promise<Folders[]> => {
  const [errors] = await to(checkPermission({ token, workspaceId, userId }));
  if (errors) throw new Error('权限不足');
  const { data, error } = await supabaseNote(token)
    .from('folders')
    .select('*')
    .eq('workspaceId', workspaceId)
    .eq('inTrash', true);
  if (error) throw new Error('服务器错误');
  return data;
};

/**
 * ### 恢复白板垃圾桶
 * @param param0
 * @returns
 */
export const restoreFolderTrash = async ({
  token,
  id,
  userId,
  workspaceId,
}: {
  token: string;
  id: string;
  workspaceId: string;
  userId: string;
}): Promise<boolean> => {
  const [errors] = await to(checkPermission({ token, workspaceId, userId }));
  if (errors) throw new Error('权限不足');
  const { error } = await supabaseNote(token)
    .from('folders')
    .update({ inTrash: false })
    .eq('id', id)
    .eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return true;
};
