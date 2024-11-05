import { supabase } from "@/database/supbash";
import { Board } from "@/types/board";
import { UserImage } from "@/types/user";
interface GetUserImage {
  userId: string;
}
/**
 * 获取看板数据
 * @returns
 */
export const getBoardData = async () => {
  const { data, error } = await supabase.from("board").select("*");
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
    .from("userImage")
    .select("*")
    .eq("id", userId);
  console.log(data, error);
  if (error) throw new Error(error.message);
  return data;
};

interface CreateBoard {
  id: string;
  name: string;
  json: string;
  width: number;
  height: number;
}
/**
 * 创建看板
 * @returns
 */
export const createBoard = async (board: CreateBoard): Promise<Board> => {
  const { data, error } = await supabase
    .from("board")
    .insert([board])
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  return data;
};
