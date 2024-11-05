import { supabase } from "@/database/supbash";
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
