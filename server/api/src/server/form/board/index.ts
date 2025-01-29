import { nanoid } from 'nanoid';
import type { Form } from '../../../types/form';
import { supabaseForm } from '../../supabase/form';

/**
 * ## 创建白板
 * @param param0
 * @returns
 */
export const createBoard = async ({
  name,
  id,
  description,
  userId,
  token,
  schema,
}: {
  name: string;
  description: string;
  userId: string;
  id: string;
  token: string;
  schema: string;
}): Promise<Form> => {
  const { data, error } = await supabaseForm(token)
    .from('form')
    .insert([
      {
        name,
        id,
        descitption: description,
        schema,
        userId,
        inviteCode: nanoid(6),
      },
    ])
    .select('*');
  if (error) throw new Error('服务器错误');

  return data[0];
};

/**
 * ## 获取白板
 * @param param0
 * @returns
 */
export const getBoard = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}): Promise<Form[]> => {
  const { data, error } = await supabaseForm(token).from('form').select('*').eq('userId', userId);
  if (error) throw new Error('服务器错误');

  return data;
};

/**
 * ## 删除白板
 * @param param0
 * @returns
 */
export const deleteBoard = async ({
  token,
  userId,
  boardId,
}: {
  token: string;
  userId: string;
  boardId: string;
}): Promise<boolean> => {
  const { error } = await supabaseForm(token)
    .from('form')
    .delete()
    .eq('id', boardId)
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * ## 更新
 */
export const updateBoard = async ({
  token,
  userId,
  boardId,
  name,
  description,
  schema,
}: {
  token: string;
  userId: string;
  boardId: string;
  name?: string;
  description?: string;
  schema?: string;
}): Promise<boolean> => {
  const updateData: Partial<Form> = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (schema) updateData.schema = schema;
  if (Object.keys(updateData).length === 0) return true;
  const { data, error } = await supabaseForm(token)
    .from('form')
    .update([updateData])
    .eq('id', boardId)
    .eq('userId', userId)
    .select('*');
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * ## 获取表单详情
 * @param param0
 * @returns
 */
export const getBoardDetail = async ({
  token,
  userId,
  boardId,
}: {
  token: string;
  userId: string;
  boardId: string;
}): Promise<Form> => {
  const { data, error } = await supabaseForm(token)
    .from('form')
    .select('*')
    .eq('id', boardId)
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  if (!data) throw new Error('未找到资源');
  return data[0];
};

/**
 * ## 更新邀请码
 * @param param0
 * @returns
 */
export const updateBoardInviteCode = async ({
  token,
  userId,
  boardId,
}: {
  token: string;
  userId: string;
  boardId: string;
}): Promise<boolean> => {
  const { error } = await supabaseForm(token)
    .from('form')
    .update([{ inviteCode: nanoid(6) }])
    .eq('id', boardId)
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * ## 获取邀请码数据
 * @param param0
 * @returns
 */
export const getInviteCodeData = async ({
  token,
  inviteCode,
}: {
  token: string;
  inviteCode: string;
}): Promise<Form> => {
  const { data, error } = await supabaseForm(token)
    .from('form')
    .select('*')
    .eq('inviteCode', inviteCode);
  if (error) throw new Error('服务器错误');
  if (!data.length) throw new Error('未找到资源');
  return data[0];
};

/**
 * ## 更新字段表单数据
 * @param param0
 * @returns
 */
export const updateBoardSchema = async ({
  token,
  userId,
  boardId,
  schema,
}: {
  token: string;
  userId: string;
  boardId: string;
  schema: string;
}): Promise<boolean> => {
  const { error } = await supabaseForm(token)
    .from('form')
    .update([{ schema }])
    .eq('id', boardId)
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return true;
};
