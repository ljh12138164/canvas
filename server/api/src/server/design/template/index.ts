import type { Board } from '../../../types/design/board';
import type { Template } from '../../../types/design/template';
import { supabaseDesign, supabaseDesignPublic } from '../../supabase/design';

/**
 * ### 获取默认模板
 * @param userId 用户id
 * @param token 用户token
 * @returns 默认模板
 */
export const getTemplate = async (): Promise<Template[]> => {
  const { data, error } = await supabaseDesignPublic.from('template').select('*');
  if (error) throw new Error('服务器错误');
  return data;
};

/**
 * ### 获取用户模板
 * @param userId 用户id
 * @param token 用户token
 * @returns 用户模板
 */
export const getUserTemplate = async (userId: string, token: string): Promise<Board[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('board')
    .select('*')
    .eq('userId', userId)
    .eq('isTemplate', true);
  if (error) throw new Error('服务器错误');
  return data;
};
