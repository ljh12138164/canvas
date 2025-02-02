import type { PostgrestError } from '@supabase/supabase-js';
import to from 'await-to-js';
import { nanoid } from 'nanoid';
import type { Remark, Task, TaskWithWorkspace } from '../../../types/jebt/board';
import { TaskStatus } from '../../../types/jebt/board';
import { supabaseJebtToken } from '../../supabase/jebt';
import { checkMember, checkUser } from '../board';

/**
 * 创建任务
 * @param param0
 * @returns
 */
export const createJebtTask = async ({
  name,
  projectId,
  workspaceId,
  description,
  assigneeId,
  status,
  currentUserId,
  lastTime,
  token,
}: {
  name: string;
  projectId: string;
  workspaceId: string;
  description?: string;
  assigneeId: string;
  status: TaskStatus;
  lastTime: string;
  currentUserId: string;
  token: string;
}) => {
  const id = nanoid();
  const [error] = await to(checkMember(currentUserId, workspaceId));
  if (error) throw new Error('无权限');
  const { data, error: taskError } = await supabaseJebtToken(token)
    .from('tasks')
    .insert([
      {
        id,
        name,
        position: 1000,
        projectId,
        workspaceId,
        description,
        assigneeId,
        status,
        lastTime,
      },
    ])
    .select('*');
  if (taskError) throw new Error('服务器错误');
  return data;
};

/**
 * 获取任务
 * @param param0
 * @returns
 */
export const getJebtTask = async ({
  currentUserId,
  workspaceId,
  projectId,
  assigneeId,
  status,
  search,
  lastTime,
  token,
}: {
  currentUserId: string;
  workspaceId: string;
  projectId: string | null | undefined;
  search: string | null | undefined;
  status: TaskStatus | null | undefined;
  assigneeId: string | null | undefined;
  lastTime: string | null | undefined;
  token: string;
}) => {
  const [error] = await to(checkMember(currentUserId, workspaceId));
  if (error) throw new Error('无权限');
  const query = supabaseJebtToken(token)
    .from('tasks')
    .select('*,workspace(*,member(*)),projects(*)')
    .eq('workspaceId', workspaceId)
    .order('created_at', { ascending: false });

  if (projectId) query.eq('projectId', projectId);
  if (status && status !== TaskStatus.ALL) query.eq('status', status);
  if (assigneeId) query.eq('assigneeId', assigneeId);
  if (lastTime) query.gte('lastTime', lastTime);
  if (search) query.textSearch('name', search);

  const { data, error: taskError } = (await query) as {
    data: TaskWithWorkspace[];
    error: PostgrestError | null;
  };
  if (taskError) throw new Error('服务器错误');
  return data;
};

/**
 * 删除任务
 * @param param0
 * @returns
 */
export const deleteJebtTask = async ({
  id,
  currentUserId,
  workspaceId,
  projectId,
  token,
}: {
  id: string;
  currentUserId: string;
  workspaceId: string;
  projectId: string;
  token: string;
}) => {
  const [error] = await to(checkMember(currentUserId, workspaceId));
  if (error) throw new Error('无权限');
  const { error: taskError } = await supabaseJebtToken(token)
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('workspaceId', workspaceId)
    .eq('projectId', projectId);
  if (taskError) throw new Error('服务器错误');
  return true;
};

/**
 * 更新任务
 * @param param0
 * @returns
 */
export const updateJebtTask = async ({
  projectId,
  workspaceId,
  description,
  assigneeId,
  status,
  name,
  currentUserId,
  lastTime,
  id,
  token,
}: {
  name: string;
  projectId: string;
  workspaceId: string;
  description?: string;
  assigneeId: string;
  status: TaskStatus;
  lastTime: string;
  currentUserId: string;
  id: string;
  token: string;
}) => {
  const [error] = await to(checkUser(currentUserId, workspaceId));
  if (error) throw new Error('无权限');
  const { data, error: taskError } = await supabaseJebtToken(token)
    .from('tasks')
    .update([
      {
        position: 1000,
        description,
        assigneeId,
        status,
        lastTime,
        name,
      },
    ])
    .eq('id', id)
    .eq('workspaceId', workspaceId)
    .eq('projectId', projectId)
    .select('*');
  if (taskError) throw new Error('服务器错误');
  return data;
};

/**
 * 根据id获取任务详情
 * @param param0
 * @returns
 */
export const getJebtTaskDetail = async ({
  id,
  workspaceId,
  projectId,
  currentUserId,
  token,
}: {
  id: string;
  workspaceId: string;
  projectId: string;
  currentUserId: string;
  token: string;
}): Promise<Task & { remark: Remark[] }> => {
  const [error] = await to(checkUser(currentUserId, workspaceId));
  if (error) throw new Error('无权限');
  const { data, error: taskError } = await supabaseJebtToken(token)
    .from('tasks')
    .select('*,remark(*)')
    .eq('id', id)
    .eq('workspaceId', workspaceId)
    .eq('projectId', projectId);

  if (taskError) throw new Error('服务器错误');
  return data[0];
};

/**
 * 添加评论
 * @param param0
 * @returns
 */
export const addJebtTaskRemark = async ({
  taskId,
  content,
  currentUserId,
  token,
}: {
  taskId: string;
  content: string;
  currentUserId: string;
  token: string;
}) => {
  const id = nanoid();
  const { data, error: taskError } = await supabaseJebtToken(token)
    .from('remark')
    .insert([{ id, taskId, content, userId: currentUserId }])
    .select('*');
  // console.log(taskError);
  if (taskError) throw new Error('服务器错误');
  return data[0];
};

/**
 * ## 移动任务
 *
 */
export const moveJebtTask = async ({
  taskId,
  currentUserId,
  workspaceId,
  projectId,
  position,
  TaskStatus,
  token,
}: {
  taskId: string;
  currentUserId: string;
  workspaceId: string;
  projectId: string;
  position: number;
  TaskStatus: TaskStatus;
  token: string;
}) => {
  const [error] = await to(checkUser(currentUserId, workspaceId));
  if (error) throw new Error('无权限');
  const { data, error: taskError } = await supabaseJebtToken(token)
    .from('tasks')
    .update([
      {
        position,
        status: TaskStatus,
        updated_at: new Date().toISOString(),
      },
    ])
    .eq('id', taskId)
    .eq('workspaceId', workspaceId)
    .eq('projectId', projectId)
    .select('*');
  if (taskError) throw new Error('服务器错误');
  return data;
};
