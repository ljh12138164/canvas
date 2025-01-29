import { nanoid } from 'nanoid';
import type { Form, SumbitForm } from '../../../types/form';
import { supabaseForm } from '../../supabase/form';

/**
 * ## 创建提交
 * @param param0
 * @returns
 */
export const createSubmit = async ({
  token,
  id,
  submit,
  userId,
}: {
  token: string;
  id: string;
  submit: string;
  userId: string;
}): Promise<SumbitForm> => {
  const { data, error } = await supabaseForm(token)
    .from('submit')
    .insert([
      {
        id: nanoid(),
        formId: id,
        userId,
        submit,
      },
    ])
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * ## 获取我的提交
 * @param param0
 * @returns
 */
export const getMySubmit = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}): Promise<(SumbitForm & { form: Form })[]> => {
  const { data, error } = await supabaseForm(token)
    .from('submit')
    .select('*,form(*)')
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return data;
};
5;
/**
 * ### 根据id获取提交
 * @param param0
 * @returns
 */
export const getMySubmitById = async ({
  token,
  id,
  userId,
}: {
  token: string;
  id: string;
  userId: string;
}): Promise<SumbitForm & { form: Form }> => {
  const { data, error } = await supabaseForm(token)
    .from('submit')
    .select('*,form(*)')
    .eq('id', id)
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  if (data.length === 0) throw new Error('资源不存在');
  return data[0];
};
