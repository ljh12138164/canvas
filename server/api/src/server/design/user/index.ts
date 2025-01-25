import type { Profiles } from 'src/types/note/workspace';
import type { Collections, Show, Upvote } from '../../../types/design/show';
import { supabaseDesign, supabaseServiceDesign } from '../../supabase/design/index';

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
    const { data, error } = await supabaseDesign(token)
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
    const { data, error } = await supabaseDesign(token)
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
  const { data, error } = await supabaseServiceDesign.auth.admin.updateUserById(userId, {
    password,
  });
  if (error) throw Error(error.message, { cause: error });
  return data;
};

/**
 * ### 获取用户点赞
 * @param token
 * @param userId
 * @returns
 */
export const getUserLike = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}): Promise<(Upvote & { show: Show & { profiles: Profiles } })[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('upvotes')
    .select('*,show(*,profiles(*))')
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return data;
};

/**
 * ### 获取用户的收藏
 * @param token
 * @param userId
 * @returns
 */
export const getUserCollect = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}): Promise<(Collections & { show: Show & { profiles: Profiles } })[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('collections')
    .select('*,show(*,profiles(*))')
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return data;
};
