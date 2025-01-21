import to from 'await-to-js';
import { nanoid } from 'nanoid';
import { supabaseJebt } from '../../../server/supabase/jebt';
import type { Flow } from '../../../types/jebt/board';
import { checkUser } from '../board';

/**
 * ## 创建文件
 * @param name 文件名字
 * @param description 文件描述
 * @param workspaceId 工作区id
 * @param userId 用户id
 * @returns
 */
export const createFlow = async ({
  name,
  description,
  workspaceId,
  userId,
}: {
  name: string;
  description: string | undefined;
  workspaceId: string;
  userId: string;
}): Promise<Flow> => {
  const [noUser] = await to(checkUser(userId, workspaceId));
  if (noUser) throw new Error('未找到用户');
  const { error, data } = await supabaseJebt
    .from('flow')
    .insert([
      {
        name,
        id: nanoid(),
        description,
        userId,
        workspaceId,
      },
    ])
    .select('*');

  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * @description 获取文件列表
 * @param workspaceId 工作区id
 * @param userId 用户id
 * @returns
s*/
export const getJebtFlow = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}): Promise<Flow[]> => {
  const [noUser] = await to(checkUser(userId, workspaceId));
  if (noUser) throw new Error('未找到用户');
  const { data, error } = await supabaseJebt.from('flow').select('*').eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return data;
};

export const deleteJebtFlow = async ({
  id,
  userId,
  workspaceId,
}: {
  id: string;
  userId: string;
  workspaceId: string;
}) => {
  const [noUser] = await to(checkUser(userId, workspaceId));
  if (noUser) throw new Error('未找到用户');
  const { error } = await supabaseJebt.from('flow').delete().eq('id', id).eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * ## 更新文件
 * @param id 文件id
 * @param userId 用户id
 * @param workspaceId 工作区id
 * @param name 文件名字
 * @param description 文件描述
 * @returns
 */
export const updateJebtFlow = async ({
  id,
  userId,
  workspaceId,
  name,
  description,
}: {
  id: string;
  userId: string;
  workspaceId: string;
  name: string;
  description: string;
}): Promise<Flow> => {
  const [noUser] = await to(checkUser(userId, workspaceId));
  if (noUser) throw new Error('未找到用户');
  const { error, data } = await supabaseJebt.from('flow').update({ name, description }).eq('id', id).eq('workspaceId', workspaceId).select('*');
  // console.log(error, data);
  if (error) throw new Error('服务器错误');
  return data[0];
};
