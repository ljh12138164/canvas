import { supabaseJebt } from "../../../server/supabase/jebt";
import { Workspace } from "../../../types/jebt/board";

export const createJebtWorkspace = async ({
  name,
  userId,
}: {
  name: string;
  userId: string;
}): Promise<Workspace> => {
  const { data, error } = await supabaseJebt
    .from("workspace")
    .insert([{ name, userId: userId }])
    .select("*");
  if (error) throw new Error(error.message);
  return data[0];
};
