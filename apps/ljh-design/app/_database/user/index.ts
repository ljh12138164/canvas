import type { Sessions } from '@/app/_types/user';
import to from 'await-to-js';
import { deleteImageClound, uploadImageclound } from '../image';
import supabase from '../supabase';
const DEFAULT_AVATAR =
  'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui/avatar.svg';

const USER_IMAGE = 'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/';
const DEFAULT_TEMPLATE =
  'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//defaultTemplate.png';
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
  const { data: login } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (login) return;
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
  if (error) if (error.message === 'Invalid login credentials') throw new Error('账户或密码错误');

  return data;
}

/**
 * ### 更新用户名
 * @param name
 * @returns
 */
export async function updateName(name: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { name },
  });
  if (error) throw new Error('服务器错误');
  return data;
}

/**
 * ### 更新用户头像
 * @param imageUrl
 * @returns
 */
export async function updateImage(imageUrl: string | File, oldImageUrl: string) {
  // 如果是图片链接，则不更新
  if (!(imageUrl instanceof File)) return;
  const uploadImage = await uploadImageclound({ file: imageUrl });
  // 更新图像
  const { data, error } = await supabase.auth.updateUser({
    data: { image: USER_IMAGE + uploadImage },
  });
  if (error) throw new Error('服务器错误');
  // 如果旧头像不是默认头像，则删除旧头像
  if (oldImageUrl !== DEFAULT_AVATAR) await deleteImageClound({ image: oldImageUrl });
  return data;
}

/**
 * 更新用户信息
 * @param param0
 * @returns
 */
export async function updateCurrentUser({
  datas,
}: {
  datas:
    | {
        type: 'name';
        name: string;
      }
    | {
        type: 'image';
        image: string | File;
        oldImageUrl: string;
      };
}) {
  if (datas.type === 'image') {
    const [error, data] = await to(updateImage(datas.image, datas.oldImageUrl));
    if (error) throw new Error('修改失败');
    return data;
  }
  if (datas.type === 'name') {
    const [error, data] = await to(updateName(datas.name));
    if (error) throw new Error('修改失败');
    return data;
  }
}
