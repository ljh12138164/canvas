import { DEFAULT_AVATAR, toast, USER_IMAGE_URL } from '@/lib';
import { nanoid } from 'nanoid';
import to from 'await-to-js';

/**
 * @description 上传图片到云端
 * @param file 文件
 * @returns 图片路径
 */
export const uploadImageclound = async ({
  file,
  supabase,
}: {
  file: File;
  supabase: any;
}) => {
  // 设置照片名字
  const fileName = `${nanoid()}-${file.name}`.replace('/', '');
  const { data, error } = await supabase.storage // 桶名字
    .from('ASSETS')
    .upload(fileName, file);
  if (error) throw new Error('服务器错误');
  return USER_IMAGE_URL + data.fullPath;
};

/**
 * @description 删除图片
 * @param image 图片路径
 * @returns 图片路径
 */
export const deleteImageClound = async ({
  image,
  supabase,
}: {
  image: string;
  supabase: any;
}): Promise<true> => {
  const { error } = await supabase.storage //  桶名字
    .from('ASSETS')
    // 删除图片路径
    .remove([image]);
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * ## 获取用户消息
 */
export async function getCurrentUser({ supabase }: { supabase: any }) {
  // 获取用户信息
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  //获取用户权限
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error('服务器错误');
  return { user: data?.user, session: session.session };
}
/**
 * ## 登出
 */
export async function logout({ supabase }: { supabase: any }) {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('服务器错误');
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
  router,
  supabase,
}: {
  username: string;
  email: string;
  password: string;
  router: any;
  supabase: any;
}) {
  const [errors] = await to(login({ email, password, supabase }));
  if (!errors) {
    toast.error('用户已存在');
    router.push('/home');
  }
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
  supabase,
}: {
  email: string;
  password: string;
  supabase: any;
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
  supabase,
}: {
  password: string;
  name: string;
  imageUrl: string | File;
  oldImageUrl: string;
  supabase: any;
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
    if (oldImageUrl !== DEFAULT_AVATAR)
      deletePromise = deleteImageClound({ image: oldImageUrl, supabase });
    const [result] = await Promise.all([
      uploadImageclound({ file: imageUrl, supabase }),
      deletePromise,
    ]);
    userData.data.image = result;
  }
  // 更新用户信息
  const { data, error } = await supabase.auth.updateUser(userData);
  if (error) throw new Error('服务器错误');
  return data.user;
}
