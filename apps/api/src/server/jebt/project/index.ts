import { supabaseJebt } from "../../supabase/jebt";
import { Project } from "../../../types/jebt/board";
import { checkMember, checkUser, uploadImageclound } from "../board";
import to from "await-to-js";
import { nanoid } from "nanoid";

/**
 * 获取项目数据
 * @param workspaceId
 * @returns
 */
export const getJebtWorkspaceProject = async (
  userId: string,
  workspaceId: string
): Promise<Project[]> => {
  const [checkUserError] = await to(checkUser(userId, workspaceId));
  if (checkUserError) throw new Error("无权限");
  const { data, error } = await supabaseJebt
    .from("projects")
    .select("*")
    .eq("workspaceId", workspaceId);
  if (error) throw new Error("服务器错误");
  return data;
};

/**
 * 创建项目
 * @param project
 * @returns
 */
export const createJebtProject = async ({
  workspaceId,
  imageUrl,
  name,
  userId,
}: {
  workspaceId: string;
  imageUrl: string | File;
  name: string;
  userId: string;
}) => {
  const id = nanoid();
  const [checkUserError] = await to(checkMember(userId, workspaceId));
  if (checkUserError) throw new Error("无权限");
  if (typeof imageUrl !== "string") {
    const path = await uploadImageclound({ file: imageUrl });
    const { data, error } = await supabaseJebt
      .from("projects")
      .insert([{ workspaceId, name, userId, id, imageUrl: path }])
      .select("*");
    if (error) throw new Error("服务器错误");
    return data[0];
  } else {
    const { data, error } = await supabaseJebt
      .from("projects")
      .insert([{ workspaceId, name, userId, id, imageUrl }])
      .select("*");
    if (error) throw new Error("服务器错误");
    return data[0];
  }
};
