import { supabaseForm } from '../../supabase/form';
import { Form } from '../../../types/form';
import { nanoid } from 'nanoid';

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
  const { data, error } = await supabaseForm(token)
    .from('form')
    .select('*')
    .eq('userId', userId);
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
  console.log(data);
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
