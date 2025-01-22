import to from 'await-to-js';
import { nanoid } from 'nanoid';
import { supabaseJebt } from '../../../server/supabase/jebt';
import type { StoageData } from '../../../types/jebt/board';
import { JEBT_URL, checkUser } from '../board';

/**
 * @description 上传图文件到云端
 * @param file 文件
 * @returns 图片路径
 */
export const uploadImageclound = async ({
  file,
  workspaceId,
  name,
}: {
  file: File;
  workspaceId: string;
  name: string;
}) => {
  // 设置文件名字
  const fileName = `${workspaceId}/${nanoid()}-${name}`.replace('/', '');
  const { data, error } = await supabaseJebt.storage
    // 桶名字
    .from('WROKSPACE')
    .upload(fileName, file);
  if (error) {
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
}): Promise<boolean> => {
  const { error } = await supabaseJebt.storage
    //  桶名字
    .from('WROKSPACE')
    // 删除图片路径
    .remove([image]);
  if (error) throw new Error('服务器错误');

  return true;
};

/**
 * ## 创建文件
 * @param file 文件
 * @param name 文件名字
 * @param description 文件描述
 * @param type 文件类型
 * @param workspaceId 工作区id
 * @param userId 用户id
 * @returns
 */
export const createFile = async ({
  file,
  name,
  description,
  type,
  workspaceId,
  userId,
  size,
}: {
  file: File;
  name: string;
  description: string | undefined;
  type: string;
  workspaceId: string;
  userId: string;
  size: number;
}): Promise<StoageData> => {
  const [noUser] = await to(checkUser(userId, workspaceId));
  if (noUser) throw new Error('未找到用户');
  const [uploadError, fileUrl] = await to(uploadImageclound({ file, workspaceId, name }));
  if (uploadError) throw new Error('上传文件失败');
  const { error, data } = await supabaseJebt
    .from('stoages')
    .insert([
      {
        name,
        id: nanoid(),
        description,
        file: fileUrl,
        type,
        userId,
        size,
        workspaceId,
      },
    ])
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * @description 获取文件列表
 * @param workspaceId 工作区id
 * @param userId 用户id
 * @returns
s*/
export const getJebtFileList = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}): Promise<StoageData[]> => {
  const [noUser] = await to(checkUser(userId, workspaceId));
  if (noUser) throw new Error('未找到用户');
  const { data, error } = await supabaseJebt
    .from('stoages')
    .select('*')
    .eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return data;
};

export const deleteJebtFile = async ({
  id,
  userId,
  workspaceId,
  file,
}: {
  id: string;
  userId: string;
  workspaceId: string;
  file: string;
}) => {
  const [noUser] = await to(checkUser(userId, workspaceId));

  if (noUser) throw new Error('未找到用户');
  const [deleteError] = await to(deleteImageClound({ image: file }));
  if (deleteError) throw new Error('删除文件失败');
  const { error } = await supabaseJebt
    .from('stoages')
    .delete()
    .eq('id', id)
    .eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * ## 更新文件
 * @param id 文件id
 * @param userId 用户id
 * @param workspaceId 工作区id
 * @param name 文件名字
 * @param description 文件描述
 * @returns
 */
export const updateJebtFile = async ({
  id,
  userId,
  workspaceId,
  name,
  description,
}: {
  id: string;
  userId: string;
  workspaceId: string;
  name: string;
  description: string;
}): Promise<StoageData> => {
  const [noUser] = await to(checkUser(userId, workspaceId));
  if (noUser) throw new Error('未找到用户');
  const { error, data } = await supabaseJebt
    .from('stoages')
    .update({ name, description, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspaceId', workspaceId)
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};
