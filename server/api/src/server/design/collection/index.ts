import type { Collections } from '../../../types/design/show';
import { supabaseDesign } from '../../supabase/design';

/**
 * ### 收藏
 * @param show
 * @returns
 */
export const collection = async ({
  token,
  id,
  userId,
}: {
  token: string;
  id: string;
  userId: string;
}): Promise<Collections> => {
  const { data, error } = await supabaseDesign(token)
    .from('collections')
    .insert([
      {
        showId: id,
        userId,
      },
    ])
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * ### 取消收藏
 */
export const cancelCollection = async ({
  token,
  id,
  userId,
}: {
  token: string;
  id: string;
  userId: string;
}): Promise<boolean> => {
  const { error } = await supabaseDesign(token)
    .from('collections')
    .delete()
    .eq('showId', id)
    .eq('userId', userId)
    .select('*');
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * ### 获取收藏
 */
export const getCollection = async ({
  token,
  id,
  userId,
}: {
  token: string;
  id: string;
  userId: string;
}): Promise<Collections[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('collections,show(*)')
    .select('*')
    .eq('showId', id)
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return data;
};
