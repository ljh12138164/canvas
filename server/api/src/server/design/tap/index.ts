import { supabaseDesign } from '../../../server/supabase/design';
import type { Tag } from '../../../types/design/show';

/**
 * ### 获取用户标签
 * @param userId 用户id
 * @param token 令牌
 * @returns 标签
 */
export const getUserTap = async ({
  userId,
  token,
}: {
  userId: string;
  token: string;
}): Promise<Tag[]> => {
  const { data, error } = await supabaseDesign(token).from('tags').select('*').eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return data.filter((item) => !item.isTrash);
};
/**
 * ### 创建标签
 * @param userId 用户id
 * @param token 令牌
 * @param tag 标签
 * @returns 标签
 */
export const createUserTap = async ({
  userId,
  token,
  tag,
}: {
  userId: string;
  token: string;
  tag: string;
}): Promise<Tag> => {
  const { data, error } = await supabaseDesign(token)
    .from('tags')
    .insert([{ userId, tag }])
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * ### 编辑标签
 * @param userId 用户id
 * @param token 令牌
 * @param id 标签id
 * @param tag 标签
 * @returns 标签
 */
export const editUserTap = async ({
  userId,
  token,
  id,
  tag,
}: {
  userId: string;
  token: string;
  id: string;
  tag: string;
}): Promise<Tag> => {
  const { data, error } = await supabaseDesign(token)
    .from('tags')
    .update([{ tag }])
    .eq('id', id)
    .eq('userId', userId)
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * ### 删除标签
 * @param userId 用户id
 * @param token 令牌
 * @param id 标签id
 * @returns 标签
 */
export const deleteUserTap = async ({
  userId,
  token,
  id,
}: { userId: string; token: string; id: string }): Promise<boolean> => {
  const { error } = await supabaseDesign(token)
    .from('tags')
    .delete()
    .eq('id', id)
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return true;
};
