import { supabaseJebet } from '@/server/supabase';
import type { Sessions } from '@/types/user';
import to from 'await-to-js';
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
export async function getCurrentUser(): Promise<Sessions | null> {
  let data = null;
  // 获取用户信息
  const [error, sessions] = await to(supabaseJebet.auth.getSession());
  if (error) return null;
  if (!sessions) return null;
  let postSession = sessions.data.session;
  // 如果session过期前5分钟，则更新session
  if (
    postSession?.expires_at &&
    postSession.expires_at < +new Date().getTime().toString().slice(0, 10) + 5 * 60
  ) {
    // 更新session
    const [error, data] = await to(supabaseJebet.auth.getUser());
    if (error) return null;
    if (!data) return null;
    // 更新token成功获取session
    const [errors, sessions] = await to(supabaseJebet.auth.getSession());
    if (errors) return null;
    if (!sessions) return null;
    postSession = sessions.data.session;
  }
  // 如果更新token失败，则返回null
  if (!postSession) return null;
  data = { user: postSession.user, session: postSession } as Sessions;
  //获取用户权限
  return data;
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
