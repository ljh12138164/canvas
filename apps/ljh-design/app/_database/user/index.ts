import type { Sessions } from '@/app/_types/user';
import to from 'await-to-js';
import { deleteImageClound, uploadImageclound } from '../image';
import supabase from '../supabase';
const DEFAULT_AVATAR =
  'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui/avatar.svg';
// 用户头像存储路径
const USER_IMAGE = 'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/';
export const DEFAULT_TEMPLATE =
  'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//defaultTemplate.png';
/**
 * ## 获取用户消息
 */
export async function getCurrentUser(): Promise<Sessions | null> {
  let data = null;
  // 获取用户信息
  const [error, sessions] = await to(supabase.auth.getSession());
  if (error) return null;
  if (!sessions) return null;
  let postSession = sessions.data.session;
  // 如果session过期前5分钟，则更新session
  if (
    postSession?.expires_at &&
    postSession.expires_at < +new Date().getTime().toString().slice(0, 10) + 5 * 60
  ) {
    // 更新session
    const [error, data] = await to(supabase.auth.refreshSession());
    if (error) return null;
    if (!data) return null;
    // 更新token成功获取session
    const [errors, sessions] = await to(supabase.auth.getSession());
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
  if (login.user) return;
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
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    if (error.message === 'Invalid login credentials') throw new Error('账户或密码错误');
    if (error.message === 'Email not confirmed') throw new Error('邮箱未确认');
  }
  const session = await getCurrentUser();
  if (!session) throw new Error('登录失败');
  return session;
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
