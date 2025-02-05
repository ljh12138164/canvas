import { nanoid } from 'nanoid';
import type { UserImage } from '../../../types/design/user';
import { supabaseDesign, supabaseDesignPublic } from '../../supabase/design';

const USER_IMAGE = 'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/';

interface GetUserImage {
  userId: string;
  token: string;
}
/**
 * @description 删除图片
 * @param image 图片路径
 * @returns 图片路径
 */
export const deleteImageClound = async ({
  image,
}: {
  image: string;
}): Promise<boolean> => {
  const { error } = await supabaseDesignPublic.storage
    //  桶名字
    .from('UPLOAD_IMG')
    // 删除图片路径
    .remove([image]);
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * 获取用户图片
 * @param userId 用户id
 * @param token 用户token
 * @returns
 */
export const getUserImage = async ({ userId, token }: GetUserImage): Promise<UserImage[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('userImage')
    .select('*')
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  return data;
};
interface CreateUserImage {
  userId: string;
  token: string;
  url: string;
  star: boolean;
}

/**
 * 创建用户图片
 * @param userId 用户id
 * @param token 用户token
 * @param url 图片url
 * @param star 是否来自推荐图片
 * @returns
 */
export const createUserImage = async ({
  userId,
  token,
  url,
  star,
}: CreateUserImage): Promise<UserImage[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('userImage')
    .insert([{ userId, url, star, id: nanoid() }])
    .select('*');
  if (error) throw new Error('服务器错误');
  return data;
};

interface DeleteUserImage {
  userId: string;
  token: string;
  id: string;
  url: string;
}

export const deleteUserImage = async ({
  userId,
  token,
  url,
}: DeleteUserImage): Promise<boolean> => {
  // 删除上传的图片
  if (url.startsWith(USER_IMAGE)) {
    await deleteImageClound({ image: url });
  }
  const { error } = await supabaseDesign(token)
    .from('userImage')
    .delete()
    .eq('userId', userId)
    .eq('url', url);
  if (error) throw new Error('服务器错误');
  return true;
};
