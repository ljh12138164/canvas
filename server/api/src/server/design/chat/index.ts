import to from 'await-to-js';
import type { ChatMessage, MessageType } from '../../../types/design/chat';
import { supabaseJebtToken } from '../../supabase/jebt';
// import { checkUser, uploadImageclound } from '../board';

const PAGE_SIZE = 10;

/**
 * ### 检查是否为好友
 * @param sendId
 * @param converId
 * @param token
 * @returns
 */
export const checkUser = async (sendId: string, converId: string, token: string) => {
  const { data, error } = await supabaseJebtToken(token)
    .from('friend')
    .select('*')
    .or(
      `and(userId.eq.${sendId},adduser.eq.${converId}),and(userId.eq.${converId},adduser.eq.${sendId})`,
    )
    .eq('isInvite', true);
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error('用户不是好友关系');
  return data;
};
/**
 * ## 获取聊天记录
 * @param workspaceId
 * @param userId
 * @returns
 */
export const getChatMessage = async (
  workspaceId: string,
  userId: string,
  pageTo: number,
  token: string,
): Promise<{ data: ChatMessage[]; count: number | null; pageTo: number }> => {
  const [error] = await to(checkUser(userId, workspaceId, token));
  if (error) throw new Error(error.message);

  const {
    data,
    error: supabaseError,
    count,
  } = await supabaseJebtToken(token)
    .from('chat')
    .select('*', {
      count: 'exact',
    })
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
export const sendChatMessage = async ({
  token,
  sendId,
  converId,
  type,
  message,
}: {
  token: string;
  sendId: string;
  converId: string;
  type: MessageType;
  message: string;
}): Promise<ChatMessage> => {
  const [error] = await to(checkUser(sendId, converId, token));
  if (error) throw new Error(error.message);

  const { data, error: supabaseError } = await supabaseJebtToken(token)
    .from('chat')
    .insert([{ sendId, converId, message, type }])
    .select('*');
  if (supabaseError) throw new Error('服务器错误');
  return data[0];
};
