import { supabase } from '@/database/supbash';
import { Board, BoardResponse } from '@/types/board';
import { PAGE_SIZE } from '@/types/Edit';
import { UserImage } from '@/types/user';
interface GetUserImage {
  userId: string;
}
/**
 * 获取看板数据
 * @returns
 */
export const getBoardData = async () => {
  const { data, error } = await supabase.from('board').select('*');
  return { data, error };
};

/**
 * 获取用户图片
 * @returns
 */
export const getUserImage = async ({
  userId,
}: GetUserImage): Promise<UserImage[]> => {
  const { data, error } = await supabase
    .from('userImage')
    .select('*')
    .eq('id', userId);
  if (error) throw new Error(error.message);
  return data;
};

interface CreateBoard {
  userId: string;
  name: string;
  json?: string;
  width: number;
  height: number;
}
/**
 * 创建看板
 * @returns
 */
export const createBoard = async (board: CreateBoard): Promise<Board> => {
  const { data, error } = await supabase
    .from('board')
    .insert([board])
    .select('*')
    .single();
  if (error) throw new Error(error.message);

  return data;
};
interface GetBoard {
  id: string;
  userid: string;
}
/**
 * 获取看板数据
 * @returns
 */
export const getBoard = async ({ id, userid }: GetBoard): Promise<Board[]> => {
  const { data, error } = await supabase
    .from('board')
    .select('*')
    .eq('id', id)
    .eq('userId', userid);
  if (error) throw new Error(error.message);
  return data;
};
interface GetUserBoard {
  userid: string;
  pageParam: number;
}
/**
 * 获取用户看板
 * @returns
 *
 */
export const getUserBoard = async ({
  userid,
  pageParam,
}: GetUserBoard): Promise<BoardResponse[]> => {
  const start = pageParam * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const { data, error, count } = await supabase
    .from('board')
    .select('*', {
      count: 'exact',
    })
    .eq('userId', userid)
    .order('created_at', { ascending: false })
    .range(start, end);
  if (error) throw new Error(error.message);
  if (!count) return [];
  return data.map((item) => ({ ...item, count }));
};
/**
 * 更新看板
 * @returns
 */
interface UpdateBoard extends CreateBoard {
  id: string;
}
export const updateBoard = async ({
  id,
  userId,
  ...board
}: UpdateBoard): Promise<Board> => {
  const { data, error } = await supabase
    .from('board')
    .update([board])
    .eq('id', id)
    .eq('userId', userId)
    .select('*');
  console.log(data, error);
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
}: {
  id: string;
  userid: string;
}) => {
  const { error } = await supabase
    .from('board')
    .delete()
    .eq('id', id)
    .eq('userId', userid);
  if (error) throw new Error(error.message);
  return true;
};
