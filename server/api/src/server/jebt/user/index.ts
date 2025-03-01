import type { PostgrestError } from '@supabase/supabase-js';
import to from 'await-to-js';
import type { Member } from '../../../types/jebt/board';
import { supabaseJebt, supabaseJebtToken } from '../../supabase/jebt';
import { checkMember } from '../board';

/**
 * ## 获取工作区成员列表和自己的权限信息
 * @param workspaceId 工作区ID
 * @param userId 用户ID
 * @param token 令牌
 * @returns 工作区成员列表和自己的权限信息
 */
export const getJebtUserList = async (workspaceId: string, userId: string, token: string) => {
  const { data, error } = (await supabaseJebtToken(token)
    .from('member')
    .select('*')
    .eq('workspaceId', workspaceId)) as {
    data: Member[];
    error: PostgrestError | null;
  };
  if (error) throw new Error('服务器错误');
  if (data.length === 0) throw new Error('未找到工作区');
  const user = data.find((item) => item.userId === userId);
  if (!user) throw new Error('无权限');
  return { data, user };
};

/**
 * 修改用户角色
 * @param workspaceId 工作区id
 * @param userId 用户id
 * @param role 角色
 * @returns
 */
export const updateJebtUserRole = async ({
  workspaceId,
  userId,
  role,
  currentUserId,
  token,
}: {
  workspaceId: string;
  userId: string;
  role: 'admin' | 'member';
  currentUserId: string;
  token: string;
}) => {
  // 检查用户权限
  const [error, _] = await to(checkMember(currentUserId, workspaceId, token));
  if (error) throw new Error(error.message);
  const { data, error: memberError } = await supabaseJebtToken(token)
    .from('member')
    .update([{ role }])
    .eq('userId', userId)
    .eq('workspaceId', workspaceId)
    .select('*');
  if (memberError) throw new Error('服务器错误');
  if (!data) throw new Error('未找到用户');
  return data[0];
};

/**
 * ## 删除用户
 * @param userId 用户id
 * @param workspaceId 工作区id
 * @param currentUserId 当前用户id
 * @returns
 */
export const deleteJebtUser = async ({
  userId,
  workspaceId,
  currentUserId,
  token,
}: {
  userId: string;
  workspaceId: string;
  currentUserId: string;
  token: string;
}) => {
  // 只有删除其他用户的时候，才需要检查权限
  if (currentUserId !== userId) {
    const [error, _] = await to(checkMember(currentUserId, workspaceId, token));
    if (error) throw new Error(error.message);
  }
  const { error: memberError } = await supabaseJebtToken(token)
    .from('member')
    .delete()
    .eq('userId', userId)
    .eq('workspaceId', workspaceId);
  if (memberError) throw new Error('服务器错误');
  return true;
};

/**
 * ### 更新用户信息
 * @param token
 * @param id
 * @param name
 * @param image
 * @returns
 */
export const updateUser = async ({
  token,
  id,
  name,
  image,
}: { token: string; id: string; name: string | undefined; image: string | undefined }) => {
  if (name) {
    const { data, error } = await supabaseJebtToken(token)
      .from('profiles')
      .update([
        {
          name: name,
        },
      ])
      .eq('id', id)
      .select('*');
    if (error) throw new Error('服务器错误');
    return data;
  }
  if (image) {
    const { data, error } = await supabaseJebtToken(token)
      .from('profiles')
      .update([{ image: image }])
      .eq('id', id)
      .select('*');
    if (error) throw new Error('服务器错误');
    return data;
  }
};

/**
 * ### 更新用户密码
 * @param token
 * @param password
 * @returns
 */
export const updatePassword = async ({
  password,
  userId,
}: { password: string; userId: string }) => {
  const { data, error } = await supabaseJebt.auth.admin.updateUserById(userId, {
    password,
  });
  if (error) throw Error(error.message);
  return data;
};
