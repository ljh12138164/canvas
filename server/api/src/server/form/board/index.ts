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
  description,
  userId,
  token,
  schema,
}: {
  name: string;
  description: string;
  userId: string;
  token: string;
  schema: string;
}): Promise<Form> => {
  const { data, error } = await supabaseForm(token)
    .from('form')
    .insert([
      {
        name,
        id: nanoid(),
        description,
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
  console.log(data, error);
  if (error) throw new Error('服务器错误');

  return data;
};
