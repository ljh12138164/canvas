import { supabaseDesignPublic } from '../../supabase/design';

export const validateAdmin = async (accounte: string, password: string) => {
  const { data, error } = await supabaseDesignPublic
    .from('admin')
    .select('*')
    .eq('accounte', accounte)
    .eq('password', password);
  if (error) throw new Error('服务器错误');
  if (data.length === 0) throw new Error('用户名或密码错误');
  return !!data.length;
};
