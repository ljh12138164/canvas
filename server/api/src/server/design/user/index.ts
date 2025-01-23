import { supabaseDesign, supabaseServiceDesign } from '../../supabase/design/index';

/**
 * ### 更新用户信息
 * @param token
 * @param id
 * @param name
 * @param image
 * @returns
 */
export const updateUser = async ({
  token,
  id,
  name,
  image,
}: { token: string; id: string; name: string | undefined; image: string | undefined }) => {
  if (name) {
    const { data, error } = await supabaseDesign(token)
      .from('profiles')
      .update([
        {
          name: name,
        },
      ])
      .eq('id', id)
      .select('*');
    if (error) throw new Error('服务器错误');
    return data;
  }
  if (image) {
    const { data, error } = await supabaseDesign(token)
      .from('profiles')
      .update([{ image: image }])
      .eq('id', id)
      .select('*');
    if (error) throw new Error('服务器错误');
    return data;
  }
};

/**
 * ### 更新用户密码
 * @param token
 * @param password
 * @returns
 */
export const updatePassword = async ({
  password,
  userId,
}: { password: string; userId: string }) => {
  const { data, error } = await supabaseServiceDesign.auth.admin.updateUserById(userId, {
    password,
  });
  if (error) throw Error(error.message, { cause: error });
  return data;
};
