import { supabaseJebt } from '../../supabase/jebt';
import { checkMember } from '../board';
import to from 'await-to-js';
import { ChatMessage } from '../../../types/jebt/board';

const PAGE_SIZE = 10;
/**
 * ## 获取聊天记录
 * @param workspaceId
 * @param userId
 * @returns
 */
export const getChatMessage = async (
  workspaceId: string,
  userId: string,
  page: number
): Promise<{ data: ChatMessage[]; count: number | null; page: number }> => {
  const [error] = await to(checkMember(userId, workspaceId));
  if (error) throw new Error(error.message);

  const {
    data,
    error: supabaseError,
    count,
  } = await supabaseJebt
    .from('chat')
    .select('*', {
      count: 'exact',
    })
    .eq('workspaceId', workspaceId)
    .order('created_at', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  if (supabaseError) throw new Error('服务器错误');
  return {
    data,
    count,
    page,
  };
};

/**
 * ## 发送消息
 * @param workspaceId
 * @param userId
 * @param message
 * @returns
 */
export const sendChatMessage = async (
  workspaceId: string,
  userId: string,
  message: string
): Promise<ChatMessage> => {
  const [error] = await to(checkMember(userId, workspaceId));
  if (error) throw new Error(error.message);

  const { data, error: supabaseError } = await supabaseJebt
    .from('chat')
    .insert({ workspaceId, userId, message })
    .select('*');
  if (supabaseError) throw new Error('服务器错误');
  return data[0];
};
