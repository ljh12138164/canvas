import type { Comment } from '../../../types/design/show';
import type { Profiles } from '../../../types/note/workspace';
import { supabaseDesign } from '../../supabase/design';

/**
 * ### 创建回答
 * @param param0
 * @returns
 */
export const createAnswer = async ({
  content,
  token,
  userId,
  id,
}: {
  content: string;
  token: string;
  userId: string;
  id: string;
}): Promise<Comment> => {
  const { data, error } = await supabaseDesign(token)
    .from('answers')
    .insert({ answer: content, userId, showId: id })
    .select('*');
  if (error) throw error;
  return data[0];
};
/**
 * ### 获取回答
 * @param param0
 * @returns
 */
export const getAnswers = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<(Comment & { profiles: Profiles })[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('show')
    .select('*,answers(*,profiles(*))')
    .eq('id', id);
  if (error) throw error;
  return data[0].answers;
};
