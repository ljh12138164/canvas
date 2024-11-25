import { supabaseJebt } from '../../supabase/jebt';
import { Project } from '../../../types/jebt/board';
import { checkMember, checkUser, uploadImageclound } from '../board';
import to from 'await-to-js';
import { nanoid } from 'nanoid';
import { DEFAULT_ICON, JEBT_URL } from '../board';
import { deleteImageClound } from '../board';

/**
 * 获取项目数据
 * @param workspaceId
 * @returns
 */
export const getJebtWorkspaceProject = async (
  userId: string,
  workspaceId: string
): Promise<Project[]> => {
  const [checkUserError] = await to(checkUser(userId, workspaceId));
  if (checkUserError) throw new Error('无权限');
  const { data, error } = await supabaseJebt
    .from('projects')
    .select('*')
    .eq('workspaceId', workspaceId);
  console.log(data, error);
  if (error) throw new Error('服务器错误');
  return data;
};

/**
 * 创建项目
 * @param project
 * @returns
 */
export const createJebtProject = async ({
  workspaceId,
  imageUrl,
  name,
  userId,
}: {
  workspaceId: string;
  imageUrl: string | File;
  name: string;
  userId: string;
}): Promise<Project> => {
  const id = nanoid();
  const [checkUserError] = await to(checkMember(userId, workspaceId));
  if (checkUserError) throw new Error('无权限');
  if (typeof imageUrl !== 'string') {
    const path = await uploadImageclound({ file: imageUrl });
    const { data, error } = await supabaseJebt
      .from('projects')
      .insert([{ workspaceId, name, id, imageUrl: path }])
      .select('*');
    if (error) throw new Error('服务器错误');
    return data[0];
  } else {
    const { data, error } = await supabaseJebt
      .from('projects')
      .insert([{ workspaceId, name, id, imageUrl }])
      .select('*');
    if (error) throw new Error('服务器错误');
    return data[0];
  }
};

/**
 * 感觉workspaceId和userId和projectId获取项目列表
 * @param workspaceId
 * @param userId
 * @returns
 */
export const getJebtProjectList = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}): Promise<Project[]> => {
  const [checkUserError] = await to(checkMember(userId, workspaceId));
  if (checkUserError) throw new Error('无权限');
  const { data, error } = await supabaseJebt
    .from('projects')
    .select('*')
    .eq('workspaceId', workspaceId);
  if (error) throw new Error('服务器错误');
  return data;
};

/**
 * 更新项目
 * @returns
 */
export const updateJebtProject = async ({
  name,
  imageUrl,
  userId,
  workspaceId,
  projectId,
  oldImageUrl,
}: {
  name: string;
  imageUrl: File | string;
  userId: string;
  projectId: string;
  workspaceId: string;
  oldImageUrl: string;
}): Promise<Project> => {
  const [error, _] = await to(checkMember(userId, workspaceId));
  if (error) throw new Error(error.message);

  if (typeof imageUrl !== 'string') {
    //默认图片
    let remove: Promise<any> | null = Promise.resolve(null);
    if (oldImageUrl !== DEFAULT_ICON) {
      remove = deleteImageClound({
        image: oldImageUrl.slice(JEBT_URL.length + 11),
      });
    }
    // 上传图片
    const [_, imageUrls] = await Promise.all([
      remove,
      uploadImageclound({ file: imageUrl }),
    ]);
    const { data, error } = await supabaseJebt
      .from('projects')
      .update([
        {
          name,
          imageUrl: imageUrls,
        },
      ])
      .eq('id', projectId)
      .select('*');
    if (error) throw new Error('服务器错误');
    return data[0];
  } else {
    const { data, error } = await supabaseJebt
      .from('projects')
      .update([
        {
          name,
          imageUrl: imageUrl,
        },
      ])
      .eq('id', projectId)
      .select('*');
    if (error) throw new Error('服务器错误');
    return data[0];
  }
};

/**
 * 删除项目
 * @returns
 */
export const deleteJebtProject = async ({
  userId,
  workspaceId,
  projectId,
  imageUrl,
}: {
  userId: string;
  workspaceId: string;
  projectId: string;
  imageUrl: string;
}): Promise<boolean> => {
  const [error, _] = await to(checkMember(userId, workspaceId));
  if (error) throw new Error(error.message);
  let deleteImage: Promise<any> | null = Promise.resolve(null);
  if (imageUrl !== DEFAULT_ICON) {
    deleteImage = deleteImageClound({
      image: imageUrl.slice(JEBT_URL.length + 11),
    });
  }
  const [__, projectError] = await Promise.all([
    deleteImage,
    supabaseJebt.from('projects').delete().eq('id', projectId),
  ]);

  if (projectError.error) throw new Error('服务器错误');
  return true;
};
