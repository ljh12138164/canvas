import { Board, BoardResponse } from "../../../types/design/board";
import { UserImage } from "../../../types/design/user";
import { supabaseDesign } from "../../../server";
interface GetUserImage {
  userId: string;
}
/**
 * 获取看板数据
 * @returns
 */
export const getBoardData = async () => {
  const { data, error } = await supabaseDesign.from("board").select("*");
  return { data, error };
};

/**
 * 获取用户图片
 * @returns
 */
export const getUserImage = async ({
  userId,
}: GetUserImage): Promise<UserImage[]> => {
  const { data, error } = await supabaseDesign
    .from("userImage")
    .select("*")
    .eq("id", userId);
  if (error) throw new Error(error.message);
  return data;
};

interface CreateBoard {
  userId?: string;
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
  const { data, error } = await supabaseDesign
    .from("board")
    .insert([board])
    .select("*")
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
  const { data, error } = await supabaseDesign
    .from("board")
    .select("*")
    .eq("id", id)
    .eq("userId", userid);
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
  const start = pageParam * 7;
  const end = start + 7;
  const { data, error, count } = await supabaseDesign
    .from("board")
    .select("*", {
      count: "exact",
    })
    .eq("userId", userid)
    .order("created_at", { ascending: false })
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
  const { data, error } = await supabaseDesign
    .from("board")
    .update([board])
    .eq("id", id)
    .eq("userId", userId)
    .select("*");
  if (error || !data) throw new Error(error?.message || "更新失败");

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
  const { error } = await supabaseDesign
    .from("board")
    .delete()
    .eq("id", id)
    .eq("userId", userid);
  if (error) throw new Error(error.message);
  return true;
};

/**
 * 自动保存看板
 * @returns
 */
interface AuthSaveBoard {
  id: string;
  userId: string;
  json?: string;
  name?: string;
  width?: number;
  height?: number;
  url?: string;
  isTemplate?: boolean;
}
export const authSaveBoard = async ({
  id,
  userId,
  ...board
}: AuthSaveBoard): Promise<Board> => {
  const { data, error } = await supabaseDesign
    .from("board")
    .update([board])
    .eq("id", id)
    .eq("userId", userId)
    .select("*");
  if (error || data.length === 0) throw new Error(error?.message || "更新失败");
  return data[0];
};
/**
 * 复制看板
 * @returns
 */
export const copyBoard = async ({
  userId,
  board,
}: {
  board: CreateBoard;
  userId: string;
}): Promise<Board> => {
  const { data, error } = await supabaseDesign
    .from("board")
    .insert([{ ...board, userId }])
    .select("*");
  console.log(data, error);
  if (error) throw new Error(error.message);
  return data[0];
};
