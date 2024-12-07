import { supabaseNote } from "../../supabase/note";
import {
  Collaborators,
  Profiles,
  Workspace,
} from "../../../types/note/workspace";
import { PostgrestError } from "@supabase/supabase-js";
import to from "await-to-js";
import { checkPermission } from "../workspace";

// 邀请协作者
export const inviteCollaborator = async ({
  inviteCode,
  token,
  userId,
}: {
  inviteCode: string;
  token: string;
  userId: string;
}): Promise<Collaborators> => {
  const { data: workspace, error: workspaceError } = (await supabaseNote(token)
    .from("workspace")
    .select("*,collaborators(*)")
    .eq("inviteCode", inviteCode)) as {
    data: (Workspace & { collaborators: Collaborators[] })[];
    error: PostgrestError | null;
  };
  if (workspaceError) {
    throw new Error("服务器错误");
  }
  if (workspace.length === 0) {
    throw new Error("工作区不存在");
  }
  if (workspace[0].collaborators.find((c) => c.userId === userId)) {
    throw new Error("已加入工作区");
  }
  const { data, error } = await supabaseNote(token)
    .from("collaborators")
    .insert([{ workspaceId: workspace[0].id, userId }])
    .select("*");

  if (error) {
    throw new Error("服务器错误");
  }
  return data[0];
};

// 获取协作者
export const getCollaborators = async ({
  token,
  workspaceId,
}: {
  token: string;
  workspaceId: string;
}): Promise<
  (Workspace & {
    collaborators: (Collaborators & { profiles: Profiles })[];
  })[]
> => {
  const { data, error } = await supabaseNote(token)
    .from("workspace")
    .select("*,collaborators(*,profiles(*))")
    .eq("id", workspaceId);
  console.log({ data, error });
  if (error) {
    throw new Error("服务器错误");
  }

  return data;
};

// 移除协作者
export const removeCollaborator = async ({
  token,
  workspaceId,
  userId,
  doUser,
}: {
  token: string;
  workspaceId: string;
  userId: string;
  doUser: string;
}): Promise<boolean> => {
  const [errors, permission] = await to(
    checkPermission({ token, workspaceId, userId: doUser })
  );
  if (errors || !permission) throw new Error("没有权限");
  const { error } = await supabaseNote(token)
    .from("collaborators")
    .delete()
    .eq("workspaceId", workspaceId)
    .eq("userId", userId);
  if (error) throw new Error("服务器错误");
  return true;
};
