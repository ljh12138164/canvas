import type { Board } from '../../../types/design/board';
import type { Show } from '../../../types/design/show';
import type { Material } from '../../../types/design/template';
import { supabaseDesign } from '../../supabase/design';

/*
 * ### 获取用户自己的话题
 * @param userId 用户id
 * @param token 用户token
 * @returns 用户话题
 */
export const getUserTopic = async (
  userId: string,
  token: string,
): Promise<(Show & { answers: Board; material: Material })[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('show')
    .select('*,board(*),material(*)')
    .eq('userId', userId);

  if (error) throw new Error('服务器错误');
  return data;
};

/**
 * ### 编辑话题
 * @param id 话题id
 * @param name 话题名称
 * @param userId 用户id
 * @param token 用户token
 */
export const editUserTopic = async ({
  id,
  name,
  explanation,
  token,
  userId,
}: {
  id: string;
  name: string;
  explanation: string;
  token: string;
  userId: string;
}): Promise<boolean> => {
  const { error } = await supabaseDesign(token)
    .from('show')
    .update({
      title: name,
      explanation,
    })
    .eq('id', id)
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * ### 删除话题
 * @param id 话题id
 * @param userId 用户id
 * @param token 用户token
 */
export const deleteUserTopic = async (
  id: string,
  userId: string,
  token: string,
): Promise<boolean> => {
  const { error } = await supabaseDesign(token)
    .from('show')
    .delete()
    .eq('id', id)
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return true;
};
