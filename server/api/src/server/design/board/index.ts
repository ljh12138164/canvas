import { Board, BoardResponse } from "../../../types/design/board";
import { UserImage } from "../../../types/design/user";
import { supabaseDesign } from "../../supabase/design";
interface GetUserImage {
  userId: string;
  token: string;
}
/**
 * 获取看板数据
 * @returns
 */
export const getBoardData = async (token: string) => {
  const { data, error } = await supabaseDesign(token).from("board").select("*");
  return { data, error };
};

/**
 * 获取用户图片
 * @returns
 */
export const getUserImage = async ({
  userId,
  token,
}: GetUserImage): Promise<UserImage[]> => {
  const { data, error } = await supabaseDesign(token)
    .from("userImage")
    .select("*")
    .eq("id", userId);
  if (error) throw new Error("服务器错误");
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
export const createBoard = async (
  board: CreateBoard,
  token: string
): Promise<Board> => {
  const { data, error } = await supabaseDesign(token)
    .from("board")
    .insert([board])
    .select("*")
    .single();
  if (error) throw new Error("服务器错误");

  return data;
};
interface GetBoard {
  id: string;
  userid: string;
  token: string;
}
/**
 * 获取看板数据
 * @returns
 */
export const getBoard = async ({
  id,
  userid,
  token,
}: GetBoard): Promise<Board[]> => {
  const { data, error } = await supabaseDesign(token)
    .from("board")
    .select("*")
    .eq("id", id)
    .eq("userId", userid);
  if (error) throw new Error("服务器错误");
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
    .from("board")
    .select("*", {
      count: "exact",
    })
    .eq("userId", userid)
    .order("created_at", { ascending: false })
    .range(start, end);
  if (error) throw new Error("服务器错误");
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
export const updateBoard = async ({
  id,
  userId,
  token,
  ...board
}: UpdateBoard): Promise<Board> => {
  const { data, error } = await supabaseDesign(token)
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
  token,
}: {
  id: string;
  userid: string;
  token: string;
}) => {
  const { error } = await supabaseDesign(token)
    .from("board")
    .delete()
    .eq("id", id)
    .eq("userId", userid);
  if (error) throw new Error("服务器错误");
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
  name?: string;
  width?: number;
  height?: number;
  image?: string;
  url?: string;
  isTemplate?: boolean;
}
export const authSaveBoard = async ({
  id,
  userId,
  token,
  ...board
}: AuthSaveBoard): Promise<Board> => {
  const { data, error } = await supabaseDesign(token)
    .from("board")
    .update([board])
    .eq("id", id)
    .eq("userId", userId)
    .select("*");
  console.log(data);
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
  token,
}: {
  board: CreateBoard;
  userId: string;
  token: string;
}): Promise<Board> => {
  const { data, error } = await supabaseDesign(token)
    .from("board")
    .insert([{ ...board, userId }])
    .select("*");
  if (error) throw new Error("服务器错误");
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
    .from("board")
    .select("*")
    .eq("userId", userid);
  if (error) throw new Error("服务器错误");
  return data;
};
