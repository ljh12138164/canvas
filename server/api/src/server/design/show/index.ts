import type { Show } from 'src/types/design/show';
import type { Board, BoardResponse } from '../../../types/design/board';
import type { UserImage } from '../../../types/design/user';
import { supabaseDesign } from '../../supabase/design';

// id: string;
// title: string;
// userId: string;
// created_at: string;
// updated_at?: string;
// explanation: string;
// relativeTheme: string;
// tags: string[];
// image: string;
// json: string;
/**
 * ### 创建评论
 */
export const createShow = async ({
  content,
  tap,
  userId,
  json,
  image,
  relativeTheme,
  token,
}: {
  content: string;
  tap: string;
  userId: string;
  json: string;
  image: string;
  relativeTheme: string;
  token: string;
}): Promise<Show> => {
  const { data, error } = await supabaseDesign(token)
    .from('show')
    .insert([{ explanation: content, userId, json, image, relativeTheme, tap }])
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};
