import { supabaseForm } from "src/server/supabase/form";
import { SumbitForm } from "src/types/form";

/**
 * ## 创建提交
 * @param param0
 * @returns
 */
export const createSubmit = async ({
  token,
  id,
  submit,
  userId,
}: {
  token: string;
  id: string;
  submit: string;
  userId: string;
}): Promise<SumbitForm> => {
  const { data, error } = await supabaseForm(token)
    .from("form")
    .insert([
      {
        id,
        userId,
        submit,
      },
    ])
    .select("*");
  if (error) throw new Error("服务器错误");
  return data[0];
};
