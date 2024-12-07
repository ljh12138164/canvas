import { supabaseNote } from "../../supabase/note";
import { Folders, Profiles, Workspace } from "../../../types/note/workspace";
import { nanoid } from "nanoid";

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
  const inviteCode = nanoid(6);
  const { data, error } = await supabaseNote(token)
    .from("workspace")
    .insert<Workspace>({ title: name, userId, inconId, inviteCode })
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
}): Promise<(Workspace & { profiles: Profiles })[]> => {
  const { data, error } = await supabaseNote(token)
    .from("workspace")
    .select("*,profiles(*)")
    .eq("userId", userId);
  if (error) throw new Error("服务器错误");
  return data;
};

/**
 * 获取工作区
 */
export const getWorkspaceById = async ({
  token,
  userId,
  workspaceId,
}: {
  token: string;
  userId: string;
  workspaceId: string;
}): Promise<Workspace & { profiles: Profiles; folders: Folders[] }> => {
  const { data, error } = await supabaseNote(token)
    .from("workspace")
    .select("*,profiles(*),folders(*)")
    .eq("id", workspaceId)
    .eq("userId", userId);
  if (error) throw new Error("服务器错误");
  return data[0];
};

/**
 * 检查权限
 */
export const checkPermission = async ({
  token,
  workspaceId,
  userId,
}: {
  token: string;
  workspaceId: string;
  userId: string;
}): Promise<boolean> => {
  const { data, error } = await supabaseNote(token)
    .from("workspace")
    .select("*")
    .eq("id", workspaceId)
    .eq("userId", userId);
  if (error) throw new Error("服务器错误");
  return data.length > 0;
};
