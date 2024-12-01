import { supabaseNote } from "../../supabase/note";
import { Workspace } from "../../../types/note/workspace";

/**
 * 创建白板
 * @param param0
 * @returns
 */
export const createBoard = async ({
  title,
  content,
  id,
  inconId,
  token,
}: {
  title: string;
  id: string;
  content: string;
  inconId: string;
  token: string;
}): Promise<Workspace> => {
  const { data, error } = await supabaseNote(token)
    .from("board")
    .insert({
      title,
      content,
      workspaceOwners: id,
      inconId,
    })
    .select("*");

  if (error) throw new Error(error.message);

  return data[0];
};

/**
 * ## 查询白板
 * @param param
 * @returns
 */
export const getBoard = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<Workspace[]> => {
  const { data, error } = await supabaseNote(token)
    .from("folders")
    .select("*")
    .eq("workspaceId", id);
  if (error) throw new Error(error.message);
  return data;
};
