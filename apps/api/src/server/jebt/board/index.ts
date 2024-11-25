import to from 'await-to-js';
import { nanoid } from 'nanoid';
import { generateInviteCode } from '../../../libs/utils';
import { supabaseJebt } from '../../../server/supabase/jebt';
import { Workspace } from '../../../types/jebt/board';

export const DEFAULT_ICON =
  'https://xllpazcrvbmwkyvnpylu.supabase.co/storage/v1/object/public/USER_IMAGE/avatar.svg';
export const JEBT_URL =
  'https://xllpazcrvbmwkyvnpylu.supabase.co/storage/v1/object/public/';

/**
 * @description 上传图片到云端
 * @param file 文件
 * @returns 图片路径
 */
export const uploadImageclound = async ({ file }: { file: File }) => {
  // 设置照片名字
  const fileName = `${nanoid()}-${file.name}`.replace('/', '');
  const { data, error } = await supabaseJebt.storage
    // 桶名字
    .from('USER_IMAGE')
    .upload(fileName, file);
  if (error) {
    // Handle error
    throw new Error('服务器错误');
  }
  return JEBT_URL + data.fullPath;
};

/**
 * @description 删除图片
 * @param image 图片路径
 * @returns 图片路径
 */
export const deleteImageClound = async ({
  image,
}: {
  image: string;
}): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabaseJebt.storage
    //  桶名字
    .from('UPLOAD_IMG')
    // 删除图片路径
    .remove([image]);
  if (error) {
    throw new Error('服务器错误');
  }
  return { data, error };
};

/**
 * 检查用户权限
 * @param userId 用户id
 * @param workspaceId 仪表盘id
 * @returns
 */
export const checkMember = async (userId: string, workspaceId: string) => {
  const { data, error } = await supabaseJebt
    .from('member')
    .select('workspaceId,role')
    .eq('workspaceId', workspaceId)
    .eq('userId', userId);
  if (error) throw new Error('服务器错误');
  if (data.length === 0 || data?.[0].role === 'member')
    throw new Error('无权限');
};
/**
 * 检查是否存在该用户
 * @param userId 用户id
 * @param workspaceId 工作区id
 * @returns void
 */
export const checkUser = async (userId: string, workspaceId: string) => {
  const { data, error } = await supabaseJebt
    .from('member')
    .select('*')
    .eq('userId', userId)
    .eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  if (data.length === 0) throw new Error('无权限');
};

/**
 * 创建仪表盘
 * @param param0
 * @returns
 */
export const createJebtWorkspace = async ({
  name,
  userId,
  file,
  email,
  userImage,
  username,
}: {
  name: string;
  userId: string;
  file: File | string;
  email: string;
  userImage: string;
  username: string;
}): Promise<Workspace> => {
  if (typeof file !== 'string') {
    const imageUrl = await uploadImageclound({ file });
    const { data, error } = await supabaseJebt
      .from('workspace')
      .insert([
        {
          id: nanoid(),
          name,
          imageUrl: imageUrl,
          inviteCode: generateInviteCode(6),
        },
      ])
      .select('*');
    if (error) throw new Error('服务器错误');
    const { error: memberError } = await supabaseJebt
      .from('member')
      .insert([
        {
          userId,
          workspaceId: data[0].id,
          role: 'admin',
          email,
          userImage,
          username,
        },
      ])
      .select('*');
    if (memberError) throw new Error('服务器错误');
    return data[0];
  } else {
    const { data, error } = await supabaseJebt
      .from('workspace')
      .insert([
        {
          id: nanoid(),
          name,
          imageUrl: file,
          inviteCode: generateInviteCode(6),
        },
      ])
      .select('*');
    if (error) throw new Error('服务器错误');
    const { error: memberError } = await supabaseJebt
      .from('member')
      .insert([
        {
          userId,
          workspaceId: data[0].id,
          role: 'admin',
          email,
          userImage,
          username,
        },
      ])
      .select('*');
    if (memberError) throw new Error('服务器错误');
    return data[0];
  }
};

/**
 * ## 获取仪表盘
 * @param userId 用户id
 * @returns
 */
export const getJebtWorkspace = async (
  userId: string
): Promise<Workspace[]> => {
  const { data, error } = await supabaseJebt
    .from('member')
    .select('*,workspace(*)')
    .eq('userId', userId);
  console.log({ data, error });
  if (error) throw new Error('服务器错误');
  return data.map((item) => item.workspace);
};

/**
 * 更新仪表盘
 * @param param0
 * @returns
 */
export const updateJebtWorkspace = async ({
  id,
  name,
  file,
  userId,
  oldImageUrl,
}: {
  id: string;
  name: string;
  file: File | string;
  userId: string;
  oldImageUrl: string;
}): Promise<Workspace> => {
  const [error, _] = await to(checkMember(userId, id));
  if (error) throw new Error(error.message);

  if (typeof file !== 'string') {
    //默认图片
    let remove: Promise<any> | null = Promise.resolve(null);
    if (oldImageUrl !== DEFAULT_ICON) {
      remove = deleteImageClound({
        image: oldImageUrl.slice(JEBT_URL.length + 11),
      });
    }
    const [_, imageUrl] = await Promise.all([
      remove,
      uploadImageclound({ file }),
    ]);
    const { data, error } = await supabaseJebt
      .from('workspace')
      .update([
        {
          name,
          imageUrl: imageUrl,
          inviteCode: generateInviteCode(6),
        },
      ])
      .eq('id', id)
      .select('*');
    if (error) throw new Error('服务器错误');
    return data[0];
  } else {
    const { data, error } = await supabaseJebt
      .from('workspace')
      .update([
        {
          name,
          imageUrl: file,
          inviteCode: generateInviteCode(6),
        },
      ])
      .eq('id', id)
      .select('*');
    if (error) throw new Error('服务器错误');
    return data[0];
  }
};

/**
 * ## 删除仪表盘
 * @param id 仪表盘id
 * @param userId 用户id
 * @returns
 */
export const deleteJebtWorkspace = async (
  id: string,
  userId: string,
  imageUrl: string
): Promise<boolean> => {
  const [error, _] = await to(checkMember(userId, id));
  if (error) throw new Error(error.message);
  let deleteImage: Promise<any> | null = Promise.resolve(null);
  if (imageUrl !== DEFAULT_ICON) {
    deleteImage = deleteImageClound({
      image: imageUrl.slice(JEBT_URL.length + 11),
    });
  }
  const [__, workspaceError] = await Promise.all([
    deleteImage,
    supabaseJebt.from('workspace').delete().eq('id', id),
  ]);

  if (workspaceError) throw new Error('服务器错误');
  return true;
};

/**
 * ## 刷新仪表盘inviteCode
 * @param id 仪表盘id
 * @param userId 用户id
 * @returns
 */
export const refreshJebtWorkspace = async (
  id: string,
  userId: string
): Promise<Workspace> => {
  const [error, _] = await to(checkMember(userId, id));
  if (error) throw new Error(error.message);
  const { data, error: workspaceError } = await supabaseJebt
    .from('workspace')
    .update([{ inviteCode: generateInviteCode(6) }])
    .eq('id', id)
    .select('*');
  if (workspaceError) throw new Error('服务器错误');
  return data[0];
};

/**
 * ## 根据邀请码获取仪表盘
 * @param inviteCode 邀请码
 * @returns Workspace[]
 */
export const getJebtWorkspaceByInviteCode = async (
  inviteCode: string
): Promise<Workspace> => {
  const { data, error } = await supabaseJebt
    .from('workspace')
    .select('*')
    .eq('inviteCode', inviteCode);
  if (error) throw new Error('服务器错误');
  if (data.length === 0) throw new Error('面板不存在');
  return data[0];
};

/**
 * ## 加入仪表盘
 * @param inviteCode 邀请码
 * @param id 仪表盘id
 * @returns Workspace
 */
export const joinJebtWorkspace = async (
  userId: string,
  id: string,
  email: string,
  userImage: string,
  username: string
): Promise<Workspace> => {
  const { data: memberData, error: memberError } = await supabaseJebt
    .from('member')
    .select('workspaceId,role')
    .eq('userId', userId);
  if (memberError) throw new Error('服务器错误');
  if (memberData.length > 0) throw new Error('已加入');
  const { data, error } = await supabaseJebt
    .from('member')
    .insert([
      {
        userId,
        workspaceId: id,
        role: 'member',
        email,
        userImage,
        username,
      },
    ])
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};
