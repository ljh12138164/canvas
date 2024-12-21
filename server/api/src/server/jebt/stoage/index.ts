import to from 'await-to-js';
import { supabaseJebt } from '../../../server/supabase/jebt';
import { checkUser, JEBT_URL } from '../board';
import { nanoid } from 'nanoid';
import { StoageData } from '../../../types/jebt/board';

/**
 * @description 上传图文件到云端
 * @param file 文件
 * @returns 图片路径
 */
export const uploadImageclound = async ({
  file,
  workspaceId,
}: {
  file: File;
  workspaceId: string;
}) => {
  // 设置文件名字
  const fileName =
    workspaceId + '/' + `${nanoid()}-${file.name}`.replace('/', '');
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
  const [uploadError, fileUrl] = await to(
    uploadImageclound({ file, workspaceId })
  );
  if (uploadError) throw uploadError;
  const { error, data } = await supabaseJebt
    .from('storage')
    .insert([
      {
        name,
        description,
        file: fileUrl,
        type,
        size,
        workspaceId,
      },
    ])
    .select('*');
  if (error) throw error;
  return data[0];
};
