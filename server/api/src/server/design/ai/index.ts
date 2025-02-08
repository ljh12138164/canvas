import type { Ai } from '../../../types/design/ai';
import { supabaseDesign } from '../../supabase/design';

/**
 * ### 创建AI会话
 * @param param0
 * @returns
 */
export const createChatSession = async ({
  name,
  token,
  userId,
}: { name: string; token: string; userId: string }): Promise<Ai> => {
  const { data, error } = await supabaseDesign(token)
    .from('ai')
    .insert([
      {
        name,
        userId,
      },
    ])
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * ### 获取AI会话
 * @param param0
 * @returns
 */
export const getChatSession = async ({
  token,
  userId,
}: { token: string; userId: string }): Promise<Ai[]> => {
  const { data, error } = await supabaseDesign(token).from('ai').select('*').eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return data;
};

/**
 * ### 删除AI会话
 * @param param0
 * @returns
 */
export const deleteChatSession = async ({
  token,
  userId,
  id,
}: { token: string; userId: string; id: string }): Promise<boolean> => {
  const { error } = await supabaseDesign(token)
    .from('ai')
    .delete()
    .eq('userId', userId)
    .eq('id', id);

  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * ### 保存AI会话
 * @param param0
 * @returns
 */
export const saveChatSession = async ({
  token,
  userId,
  id,
  history,
}: {
  token: string;
  userId: string;
  id: string;
  history:
    | {
        role: string;
        parts: { text: string }[];
        type: string;
      }[]
    | undefined;
}): Promise<boolean> => {
  const { error } = await supabaseDesign(token)
    .from('ai')
    .update([{ history }])
    .eq('userId', userId)
    .eq('id', id);
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * ### 获取AI会话历史
 * @param param0
 * @returns
 */
export const getChatHistory = async ({
  token,
  userId,
  id,
}: { token: string; userId: string; id: string }): Promise<Ai> => {
  const { data, error } = await supabaseDesign(token)
    .from('ai')
    .select('*')
    .eq('userId', userId)
    .eq('id', id);
  if (error) throw new Error('服务器错误');
  return data[0];
};
