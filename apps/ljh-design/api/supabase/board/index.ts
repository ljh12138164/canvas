import { supabase } from "@/database/supbash";

/**
 * 获取看板数据
 * @returns
 */
export const getBoardData = async () => {
  const { data, error } = await supabase.from("board").select("*");
  return { data, error };
};
