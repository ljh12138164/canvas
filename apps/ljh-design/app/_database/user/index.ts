import type { Sessions } from '@/app/_types/user';
import { deleteImageClound, uploadImageclound } from '../image';
import supabase from '../supabase';
const DEFAULT_AVATAR = 'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui/avatar.svg';

/**
 * ## 获取用户消息
 */
export async function getCurrentUser(): Promise<Sessions | null> {
  // 获取用户信息
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('未登录');
    //获取用户权限
    const { data, error } = await supabase.auth.getUser();

    if (error) throw new Error('未登录');
    return { user: data?.user, session: session.session } as Sessions;
  } catch {
    return null;
  }
}
/**
 * ## 登出
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
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
  const { data, error } = await supabase.auth.signUp({
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
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
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
  const { data, error } = await supabase.auth.updateUser(userData);
  if (error) throw new Error('服务器错误');
  return data.user;
}
