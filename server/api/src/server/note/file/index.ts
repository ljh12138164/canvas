import to from 'await-to-js';
import { supabaseNote } from '../../../server/supabase/note/index';
import type { Filts } from '../../../types/note/workspace';
import { checkPermission } from '../workspace';

export const createFile = async ({
  token,
  title,
  inconId,
  workspaceId,
  content,
  userId,
  folderId,
}: {
  token: string;
  title: string;
  inconId: string;
  workspaceId: string;
  content: string;
  userId: string;
  folderId: string;
}): Promise<Filts> => {
  const [fetcherror, result] = await to(checkPermission({ token, workspaceId, userId }));
  if (fetcherror?.message === '工作区不存在') throw new Error('工作区不存在');
  if (!result) throw new Error('无权限');
  const { data, error } = await supabaseNote(token)
    .from('files')
    .insert({ title, inconId, workspaceId, data: content, foldId: folderId })
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * 获取文件垃圾桶
 * @param id
 * @param token
 * @returns
 */
export const getFileTrash = async ({
  token,
  workspaceId,
  userId,
}: { token: string; workspaceId: string; userId: string }): Promise<Filts[]> => {
  const [fetcherror, result] = await to(checkPermission({ token, workspaceId, userId }));
  if (fetcherror?.message === '工作区不存在') throw new Error('工作区不存在');
  if (!result) throw new Error('无权限');
  const { data, error } = await supabaseNote(token)
    .from('files')
    .select('*')
    .eq('inTrash', true)
    .eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return data;
};

/**
 * 更新文件
 * @param id
 * @param token
 * @returns
 */
export const updateFile = async ({
  token,
  id,
  title,
  workspaceId,
  userId,
}: {
  token: string;
  id: string;
  title: string;
  inconId: string;
  workspaceId: string;
  userId: string;
}): Promise<Filts> => {
  const [fetcherror, result] = await to(checkPermission({ token, workspaceId, userId }));
  if (fetcherror?.message === '工作区不存在') throw new Error('工作区不存在');
  if (!result) throw new Error('无权限');
  const { data, error } = await supabaseNote(token)
    .from('files')
    .update([{ title }])
    .eq('id', id)
    .eq('workspaceId', workspaceId)
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * 删除文件
 * @param id
 * @param token
 * @returns
 */
export const deleteFile = async ({
  token,
  id,
  workspaceId,
  userId,
}: {
  token: string;
  id: string;
  workspaceId: string;
  userId: string;
}): Promise<boolean> => {
  const [fetcherror, result] = await to(checkPermission({ token, workspaceId, userId }));
  if (fetcherror?.message === '工作区不存在') throw new Error('工作区不存在');
  if (!result) throw new Error('无权限');
  const { error } = await supabaseNote(token)
    .from('files')
    .delete()
    .eq('id', id)
    .eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * 软删除文件
 * @param id
 * @param token
 * @returns
 */
export const softDeleteFile = async ({
  token,
  id,
  workspaceId,
  userId,
}: { token: string; id: string; workspaceId: string; userId: string }): Promise<boolean> => {
  const [fetcherror, result] = await to(checkPermission({ token, workspaceId, userId }));
  if (fetcherror?.message === '工作区不存在') throw new Error('工作区不存在');
  if (!result) throw new Error('无权限');
  const { error } = await supabaseNote(token)
    .from('files')
    .update([{ inTrash: true }])
    .eq('id', id)
    .eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * 恢复文件
 * @param id
 * @param token
 * @returns
 */
export const restoreFile = async ({
  token,
  id,
  workspaceId,
  userId,
}: { token: string; id: string; workspaceId: string; userId: string }): Promise<boolean> => {
  const [fetcherror, result] = await to(checkPermission({ token, workspaceId, userId }));
  if (fetcherror?.message === '工作区不存在') throw new Error('工作区不存在');
  if (!result) throw new Error('无权限');
  const { error } = await supabaseNote(token)
    .from('files')
    .update([{ inTrash: false }])
    .eq('id', id)
    .eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return true;
};
