import { nanoid } from 'nanoid';
import { supabaseJebt } from '../../../server/supabase/jebt';
import { Workspace } from '../../../types/jebt/board';
import { generateInviteCode } from '../../../libs/utils';
const DEFAULT_ICON =
  'https://xllpazcrvbmwkyvnpylu.supabase.co/storage/v1/object/public/USER_IMAGE/avatar.svg';
const JEBT_URL =
  'https://xllpazcrvbmwkyvnpylu.supabase.co/storage/v1/object/public/';
/**
 * @description 上传图片到云端
 * @param file 文件
 * @returns 图片路径
 */
interface UploadImageClound {
  file: File;
}
export const uploadImageclound = async ({ file }: UploadImageClound) => {
  // 设置照片名字
  const fileName = `${nanoid()}-${file.name}`.replace('/', '');
  const { data, error } = await supabaseJebt.storage
    // 桶名字
    .from('USER_IMAGE')
    .upload(fileName, file);
  if (error) {
    // Handle error
    throw new Error(error.message);
  }
  return JEBT_URL + data.fullPath;
};
/**
 * @description 删除图片
 * @param image 图片路径
 * @returns 图片路径
 */
interface DeleteImageClound {
  image: string;
}
export const deleteImageClound = async ({
  image,
}: DeleteImageClound): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabaseJebt.storage
    //  桶名字
    .from('UPLOAD_IMG')
    // 删除图片路径
    .remove([image]);
  if (error) {
    throw new Error(error.message);
  }
  return { data, error };
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
}: {
  name: string;
  userId: string;
  file: File | string;
}): Promise<Workspace> => {
  if (typeof file !== 'string') {
    const imageUrl = await uploadImageclound({ file });
    const { data, error } = await supabaseJebt
      .from('workspace')
      .insert([
        {
          name,
          userId: userId,
          imageUrl: imageUrl,
          inviteCode: generateInviteCode(6),
        },
      ])
      .select('*');
    if (error) throw new Error(error.message);
    return data[0];
  } else {
    const { data, error } = await supabaseJebt
      .from('workspace')
      .insert([
        {
          name,
          userId: userId,
          imageUrl: file,
          inviteCode: generateInviteCode(6),
        },
      ])
      .select('*');
    if (error) throw new Error(error.message);
    return data[0];
  }
};

/**
 * 获取仪表盘
 */
export const getJebtWorkspace = async (
  userId: string
): Promise<Workspace[]> => {
  const { data, error } = await supabaseJebt
    .from('workspace')
    .select('*')
    .eq('userId', userId);
  if (error) throw new Error(error.message);
  console.log(data, error);
  return data;
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
      .eq('userId', userId)
      .select('*');
    if (error) throw new Error(error.message);
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
      .eq('userId', userId)
      .select('*');
    if (error) throw new Error(error.message);
    return data[0];
  }
};

/**
 * 删除仪表盘
 * @param id 仪表盘id
 * @param userId 用户id
 * @returns
 */
export const deleteJebtWorkspace = async (
  id: string,
  userId: string
): Promise<boolean> => {
  const { error } = await supabaseJebt
    .from('workspace')
    .delete()
    .eq('id', id)
    .eq('userId', userId);
  if (error) throw new Error(error.message);
  return true;
};

/**
 * 刷新仪表盘inviteCode
 * @param id 仪表盘id
 * @param userId 用户id
 * @returns
 */
export const refreshJebtWorkspace = async (
  id: string,
  userId: string
): Promise<Workspace> => {
  const { data, error } = await supabaseJebt
    .from('workspace')
    .update([{ inviteCode: generateInviteCode(6) }])
    .eq('id', id)
    .eq('userId', userId)
    .select('*');
  if (error) throw new Error(error.message);
  return data[0];
};
