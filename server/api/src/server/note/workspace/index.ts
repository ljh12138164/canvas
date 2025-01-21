import to from 'await-to-js';
import { nanoid } from 'nanoid';
import type { Collaborators, Filts, Folders, Profiles, Workspace } from '../../../types/note/workspace';
import { supabaseNote } from '../../supabase/note';

/**
 * 创建工作区
 */
export const createWorkspace = async ({
  name,
  inconId,
  token,
  userId,
}: {
  name: string;
  inconId: string;
  userId: string;
  token: string;
}): Promise<Workspace> => {
  const inviteCode = nanoid(6);
  const { data, error } = await supabaseNote(token).from('workspace').insert<Workspace>({ title: name, userId, inconId, inviteCode }).select('*');
  if (error) throw new Error('服务器错误');
  await supabaseNote(token).from('folders').insert<Folders>({
    title: '默认文件夹',
    workspaceId: data[0].id,
    userId,
    inconId: '📄',
  });
  return data[0];
};

/**
 * 获取工作区
 */
export const getWorkspaces = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}): Promise<(Workspace & { profiles: Profiles })[]> => {
  const [{ data: workspaces, error: workspacesError }, { data: collaborators, error: collaboratorsError }] = await Promise.all([supabaseNote(token).from('workspace').select('*,profiles(*)').eq('userId', userId), supabaseNote(token).from('collaborators').select('*,workspace(*,profiles(*))').eq('userId', userId)]);
  if (workspacesError || collaboratorsError) throw new Error('服务器错误');

  return [...workspaces, ...collaborators.map((collaborator) => (!workspaces.find((workspace) => workspace.id === collaborator.workspace.id) ? collaborator.workspace : null))].filter((workspace) => workspace !== null);
};

/**
 * 获取工作区
 */
export const getWorkspaceById = async ({
  token,
  userId,
  workspaceId,
}: {
  token: string;
  userId: string;
  workspaceId: string;
}): Promise<Workspace & { profiles: Profiles; folders: (Folders & { files: Filts[] })[] }> => {
  const { data, error } = await supabaseNote(token).from('workspace').select('*,profiles(*),folders(*,files(*)),collaborators(*)').eq('id', workspaceId);
  if (error) throw new Error('服务器错误');
  if (!data.length || (data[0].userId !== userId && !data[0].collaborators.find((collaborator: Collaborators) => collaborator.userId === userId))) throw new Error('无权限');
  return data[0];
};

/**
 * ## 检查权限
 * @param token 令牌
 * @param workspaceId 工作区id
 * @param userId 用户id
 * @returns 是否有权限
 */
export const checkPermission = async ({
  token,
  workspaceId,
  userId,
}: {
  token: string;
  workspaceId: string;
  userId: string;
}): Promise<boolean> => {
  const { data, error } = await supabaseNote(token).from('workspace').select('*,collaborators(*)').eq('id', workspaceId);
  if (error) throw new Error('服务器错误');
  if (data.length === 0) throw new Error('工作区不存在');
  if (data[0].userId === userId) return true;
  if (data[0].collaborators.find((collaborator: Collaborators) => collaborator.userId === userId)) return true;
  return false;
};

/**
 * 获取文档
 */
export const getDoc = async ({
  token,
  userId,
  id,
  type,
  workspaceId,
}: {
  token: string;
  userId: string;
  id: string;
  type: 'file' | 'folder';
  workspaceId: string;
}): Promise<Filts | Folders> => {
  const [fetcherror, result] = await to(checkPermission({ token, workspaceId, userId }));
  if (fetcherror?.message === '工作区不存在') throw new Error('工作区不存在');
  if (!result) throw new Error('无权限');
  const { data, error } = await supabaseNote(token)
    .from(type === 'file' ? 'files' : 'folders')
    .select('*')
    .eq('id', id);
  if (error) throw new Error('服务器错误');
  return data[0];
};
