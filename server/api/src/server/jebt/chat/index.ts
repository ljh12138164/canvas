import to from 'await-to-js';
import { ChatMessage } from '../../../types/jebt/board';
import { supabaseJebt } from '../../supabase/jebt';
import { checkUser } from '../board';

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
  pageTo: number
): Promise<{ data: ChatMessage[]; count: number | null; pageTo: number }> => {
  const [error] = await to(checkUser(userId, workspaceId));
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
    // 通过游标返回页数，因为用了socket.io，所以需要通过游标返回页数
    .range(pageTo, pageTo + PAGE_SIZE - 1);
  if (supabaseError) throw new Error('服务器错误');
  return {
    data,
    count,
    pageTo: pageTo + PAGE_SIZE,
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
  const [error] = await to(checkUser(userId, workspaceId));
  if (error) throw new Error(error.message);

  const { data, error: supabaseError } = await supabaseJebt
    .from('chat')
    .insert({ workspaceId, userId, message })
    .select('*');
  if (supabaseError) throw new Error('服务器错误');
  return data[0];
};
