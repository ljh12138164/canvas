import type { Frident } from '../../../types/design/chat';
import type { Profiles } from '../../../types/note/workspace';
import { supabaseDesign } from '../../supabase/design';

/**
 * ### 添加好友
 * @param userId 用户id
 * @param addUserId 添加好友id
 */
export const addFriend = async ({
  token,
  userId,
  addUserId,
}: {
  token: string;
  userId: string;
  addUserId: string;
}): Promise<Frident> => {
  const { data, error } = await supabaseDesign(token)
    .from('frident')
    .insert([{ userId, addUserId }])
    .select('*');
  if (error) throw new Error('添加好友失败');
  return data[0];
};

/**
 * ### 获取好友列表
 * @param userId 用户id
 * @param addUserId 添加好友id
 */
export const getFriendList = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}): Promise<(Frident & { user_profile: Profiles; friend_profile: Profiles })[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('frident')
    .select(`
      *,
      user_profile:profiles!frident_usedId_fkey(*),
      friend_profile:profiles!frident_adduser_fkey(*)
    `)
    .or(`usedId.eq.${userId},adduser.eq.${userId}`)
    .eq('isInvite', true);
  if (error) throw new Error('获取好友列表失败');
  return data;
};

/**
 * ### 搜索好友
 * @param token
 * @param userId
 * @param search
 */
export const searchFriend = async ({
  token,
  userId,
  search,
}: { token: string; userId: string; search: string }): Promise<Profiles[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('profiles')
    .select('*')
    .or(`name.ilike.%${search}%`)
    .neq('id', userId)
    .limit(10);
  if (error) throw new Error('搜索好友失败');
  return data;
};
