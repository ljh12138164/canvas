import { supabaseNote } from "../../supabase/note";
import { Folders, Workspace } from "../../../types/note/workspace";

/**
 * 创建工作区
 */
export const createWorkspace = async ({
  name,
  inconId,
  token,
  userId,
}: {
  name: string;
  inconId: string;
  userId: string;
  token: string;
}): Promise<Workspace> => {
  const { data, error } = await supabaseNote(token)
    .from("workspace")
    .insert<Workspace>({ title: name, userId, inconId })
    .select("*");
  if (error) throw new Error("服务器错误");
  await supabaseNote(token).from("folder").insert<Folders>({
    title: "默认文件夹",
    workspaceId: data[0].id,
    userId,
    inconId: "📄",
  });
  return data[0];
};

/**
 * 获取工作区
 */
export const getWorkspaces = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}): Promise<Workspace[]> => {
  const { data, error } = await supabaseNote(token)
    .from("workspace")
    .select("*")
    .eq("userId", userId);
  if (error) throw new Error("服务器错误");
  return data;
};
