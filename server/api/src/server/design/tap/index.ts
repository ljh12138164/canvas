import { supabaseDesign } from '../../../server/supabase/design';
import type { Tag } from '../../../types/design/show';

/**
 * 获取用户标签
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
 * 创建标签
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
