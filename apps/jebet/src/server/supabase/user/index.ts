import { supabaseJebet } from '@/server/supabase';
import type { Sessions } from '@/types/user';
import type { User } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

export const DEFAULT_AVATAR =
  'https://spvppoqewfwqyzlsmtru.supabase.co/storage/v1/object/public/ASSETS/avatar.svg';
export const USER_IMAGE_URL = 'https://spvppoqewfwqyzlsmtru.supabase.co/storage/v1/object/public/';
/**
 * @description 上传图片到云端
 * @param file 文件
 * @returns 图片路径
 */
export const uploadImageclound = async ({ file }: { file: File }) => {
  // 设置照片名字
  const fileName = `${nanoid()}-${file.name}`.replace('/', '');
  const { data, error } = await supabaseJebet.storage
    // 桶名字
    .from('USER_IMAGE')
    .upload(fileName, file);
  if (error) return DEFAULT_AVATAR;
  return USER_IMAGE_URL + data.fullPath;
};

/**
 * @description 删除图片
 * @param image 图片路径
 * @returns 图片路径
 */
export const deleteImageClound = async ({ image }: { image: string }): Promise<boolean> => {
  const { error } = await supabaseJebet.storage
    //  桶名字
    .from('USER_IMAGE')
    // 删除图片路径
    .remove([image]);
  if (error) return false;
  return true;
};

/**
 * ## 获取用户消息
 */
export async function getCurrentUser(): Promise<{ user: User; session: Sessions }> {
  // 获取用户信息
  try {
    const { data: session } = await supabaseJebet.auth.getSession();
    if (!session?.session) throw new Error('未登录');
    //获取用户权限
    const { data, error } = await supabaseJebet.auth.getUser();

    if (error) throw new Error('未登录');
    return { user: data?.user, session: session.session as Sessions };
  } catch {
    throw new Error('未登录');
  }
}
/**
 * ## 登出
 */
export async function logout() {
  const { error } = await supabaseJebet.auth.signOut();
  if (error) return false;
  return true;
}

/**
 * ## 注册
 * @param param0
 * @returns
 */
export async function signup({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  const { data, error } = await supabaseJebet.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: username,
        image: DEFAULT_AVATAR,
      },
    },
  });
  if (error) throw new Error('服务器错误');
  return data;
}

/**
 * ## 登录
 * @param param0
 * @returns
 */
export async function login({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabaseJebet.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) throw new Error('服务器错误');
  return data;
}

/**
 * 更新用户信息
 * @param param0
 * @returns
 */
export async function updateCurrentUser({
  password,
  name,
  imageUrl,
  oldImageUrl,
}: {
  password: string;
  name: string;
  imageUrl: string | File;
  oldImageUrl: string;
}) {
  const userData = {
    password,
    data: {
      name,
      image: imageUrl,
    },
  };
  if (imageUrl instanceof File) {
    let deletePromise: Promise<boolean> = Promise.resolve(true);
    if (oldImageUrl !== DEFAULT_AVATAR) deletePromise = deleteImageClound({ image: oldImageUrl });
    const [result] = await Promise.all([uploadImageclound({ file: imageUrl }), deletePromise]);
    if (result) userData.data.image = result as string;
  }
  // 更新用户信息
  const { data, error } = await supabaseJebet.auth.updateUser(userData);
  if (error) throw new Error('服务器错误');
  return data.user;
}
