import to from 'await-to-js';
import { type ChatMessage, MessageType } from '../../../types/jebt/board';
import { supabaseJebtToken } from '../../supabase/jebt';
import { checkUser, uploadImageclound } from '../board';

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
  message: string,
  token: string,
): Promise<ChatMessage> => {
  const [error] = await to(checkUser(userId, workspaceId, token));
  if (error) throw new Error(error.message);

  const { data, error: supabaseError } = await supabaseJebtToken(token)
    .from('chat')
    .insert({ workspaceId, userId, message, type: MessageType.TEXT })
    .select('*');
  if (supabaseError) throw new Error('服务器错误');
  return data[0];
};

/**
 * ## 上传图片
 * @param workspaceId
 * @param userId
 * @param file
 * @returns
 */
export const uploadImage = async (
  workspaceId: string,
  userId: string,
  file: File,
  token: string,
): Promise<ChatMessage> => {
  const [error] = await to(checkUser(userId, workspaceId, token));
  if (error) throw new Error(error.message);
  const [errors, imageUrl] = await to(uploadImageclound({ file }));
  if (errors) throw new Error(errors.message);
  const { data, error: supabaseError } = await supabaseJebtToken(token)
    .from('chat')
    .insert({ workspaceId, userId, message: imageUrl, type: MessageType.IMAGE })
    .select('*');
  if (supabaseError) throw new Error('服务器错误');
  return data[0];
};
