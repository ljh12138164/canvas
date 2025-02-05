import { nanoid } from 'nanoid';
import type { Board, BoardResponse } from '../../../types/design/board';
import { supabaseDesign, supabaseDesignPublic } from '../../supabase/design';
export const DEFAULT_TEMPLATE =
  'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//defaultTemplate.png';
const imagePath = 'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/';
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
  const { data, error } = await supabaseDesignPublic.storage
    //  桶名字
    .from('canvas')
    // 删除图片路径
    .remove([image]);
  if (error) throw new Error('服务器错误');
  return true;
};

interface UploadCustomType {
  base64: Blob;
  fullType: string;
}

/**
 * ### 上传自定义类型
 * @description 上传自定义类型
 * @param data 数据
 * @returns 图片路径
 */
export const uploadCustomType = async ({ base64, fullType }: UploadCustomType) => {
  // 生成随机名称
  const name = nanoid().split('/').join('');
  const { data, error } = await supabaseDesignPublic.storage.from('canvas').upload(name, base64, {
    contentType: fullType,
  });
  if (error) throw new Error(error.message);

  return imagePath + data.fullPath;
};

/**
 * 获取看板数据
 * @returns
 */
export const getBoardData = async (token: string) => {
  const { data, error } = await supabaseDesign(token).from('board').select('*');
  return { data, error };
};

interface CreateBoard {
  userId?: string;
  name: string;
  json?: string;
  width: number;
  height: number;
  isTemplate?: boolean;
  image?: string;
}
/**
 * 创建看板
 * @returns
 */
export const createBoard = async (board: CreateBoard, token: string): Promise<Board> => {
  const { data, error } = await supabaseDesign(token)
    .from('board')
    .insert([board])
    .select('*')
    .single();
  if (error) throw new Error('服务器错误');

  return data;
};
interface GetBoard {
  id: string;
  userid: string;
  token: string;
  type: 'template' | 'board';
}
/**
 * 获取看板数据
 * @returns
 */
export const getBoard = async ({ id, userid, token, type }: GetBoard): Promise<Board[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('board')
    .select('*')
    .eq('id', id)
    .eq('isTemplate', type === 'template');
  // TODO: 需要修改
  // .eq("userId", userid);
  if (error) throw new Error('服务器错误');
  return data;
};
interface GetUserBoard {
  userid: string;
  pageParam: number;
  token: string;
}
/**
 * 获取用户看板
 * @returns
 *
 */
export const getUserBoard = async ({
  userid,
  pageParam,
  token,
}: GetUserBoard): Promise<BoardResponse[]> => {
  const start = pageParam * 7;
  const end = start + 7;
  const { data, error, count } = await supabaseDesign(token)
    .from('board')
    .select('*', {
      count: 'exact',
    })
    .eq('userId', userid)
    .order('created_at', { ascending: false })
    .range(start, end);
  if (error) throw new Error('服务器错误');
  if (!count) return [];
  return data.map((item) => ({ ...item, count }));
};
/**
 * 更新看板
 * @returns
 */
interface UpdateBoard extends CreateBoard {
  id: string;
  token: string;
}
export const updateBoard = async ({ id, userId, token, ...board }: UpdateBoard): Promise<Board> => {
  const { data, error } = await supabaseDesign(token)
    .from('board')
    .update([board])
    .eq('id', id)
    .eq('userId', userId)
    .select('*');
  if (error || !data) throw new Error(error?.message || '更新失败');

  return data[0];
};
/**
 * 删除看板
 * @returns
 */
export const deleteBoard = async ({
  id,
  userid,
  token,
}: {
  id: string;
  userid: string;
  token: string;
}) => {
  const { error } = await supabaseDesign(token)
    .from('board')
    .delete()
    .eq('id', id)
    .eq('userId', userid);
  if (error) throw new Error('服务器错误');
  return true;
};

/**
 * 自动保存看板
 * @returns
 */
interface AuthSaveBoard {
  id: string;
  userId: string;
  token: string;
  json?: string;
  width?: number;
  height?: number;
  image: string;
  defaultImage: string;
}
/**
 * 自动保存看板
 * @returns
 */
export const authSaveBoard = async ({
  id,
  userId,
  token,
  json,
  width,
  height,
  image,
  defaultImage,
}: AuthSaveBoard): Promise<Board> => {
  // 删除原本的图片，如果默认图片是默认模板，则不删除
  if (defaultImage !== DEFAULT_TEMPLATE)
    deleteImageClound({ image: defaultImage.split('/').at(-1) as string });
  const response = await fetch(image);
  // 将base64转换为Blob
  const blob = await response.blob();

  // 上传图片
  const imageUrl = await uploadCustomType({ base64: blob, fullType: 'image/webp' });

  // 更新看板
  const { data, error } = await supabaseDesign(token)
    .from('board')
    .update([{ id, userId, json, width, height, image: imageUrl }])
    .eq('id', id)
    .eq('userId', userId)
    .select('*');
  if (error || data.length === 0) throw new Error(error?.message || '更新失败');
  return data[0];
};
/**
 * 复制看板
 * @returns
 */
export const copyBoard = async ({
  userId,
  board,
  token,
}: {
  board: CreateBoard;
  userId: string;
  token: string;
}): Promise<Board> => {
  const { data, error } = await supabaseDesign(token)
    .from('board')
    .insert([{ ...board, userId }])
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * ## 获取用户看板列表
 *
 */
export const getUserBoardList = async ({
  userid,
  token,
}: {
  userid: string;
  token: string;
}): Promise<Board[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('board')
    .select('*')
    .eq('userId', userid);
  if (error) throw new Error('服务器错误');
  return data;
};

/**
 * 克隆看板
 * @returns
 */
export const cloneBoard = async ({
  userId,
  board,
  token,
}: {
  board: CreateBoard;
  userId: string;
  token: string;
}) => {};
