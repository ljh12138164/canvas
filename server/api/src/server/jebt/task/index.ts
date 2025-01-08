import { PostgrestError } from "@supabase/supabase-js";
import to from "await-to-js";
import { nanoid } from "nanoid";
import { supabaseJebt } from "../../supabase/jebt";
import { TaskStatus, TaskWithWorkspace } from "../../../types/jebt/board";
import { checkMember, checkUser } from "../board";

/**
 * 创建任务
 * @param param0
 * @returns
 */
export const createJebtTask = async ({
  name,
  projectId,
  workspaceId,
  description,
  assigneeId,
  status,
  currentUserId,
  lastTime,
}: {
  name: string;
  projectId: string;
  workspaceId: string;
  description?: string;
  assigneeId: string;
  status: TaskStatus;
  lastTime: string;
  currentUserId: string;
}) => {
  const id = nanoid();
  const [error] = await to(checkMember(currentUserId, workspaceId));
  if (error) throw new Error("无权限");
  const { data, error: taskError } = await supabaseJebt
    .from("tasks")
    .insert([
      {
        id,
        name,
        position: 1000,
        projectId,
        workspaceId,
        description,
        assigneeId,
        status,
        lastTime,
      },
    ])
    .select("*");
  if (taskError) throw new Error("服务器错误");
  return data;
};

/**
 * 获取任务
 * @param param0
 * @returns
 */
export const getJebtTask = async ({
  currentUserId,
  workspaceId,
  projectId,
  assigneeId,
  status,
  search,
  lastTime,
}: {
  currentUserId: string;
  workspaceId: string;
  projectId: string | null | undefined;
  search: string | null | undefined;
  status: TaskStatus | null | undefined;
  assigneeId: string | null | undefined;
  lastTime: string | null | undefined;
}) => {
  const [error] = await to(checkMember(currentUserId, workspaceId));
  if (error) throw new Error("无权限");
  const query = supabaseJebt
    .from("tasks")
    .select("*,workspace(*,member(*)),projects(*)")
    .eq("workspaceId", workspaceId)
    .order("created_at", { ascending: false });

  if (projectId) query.eq("projectId", projectId);
  if (status && status !== TaskStatus.ALL) query.eq("status", status);
  if (assigneeId) query.eq("assigneeId", assigneeId);
  if (lastTime) query.gte("lastTime", lastTime);
  if (search) query.textSearch("name", search);

  const { data, error: taskError } = (await query) as {
    data: TaskWithWorkspace[];
    error: PostgrestError | null;
  };
  if (taskError) throw new Error("服务器错误");
  return data;
};

/**
 * 删除任务
 * @param param0
 * @returns
 */
export const deleteJebtTask = async ({
  id,
  currentUserId,
  workspaceId,
  projectId,
}: {
  id: string;
  currentUserId: string;
  workspaceId: string;
  projectId: string;
}) => {
  const [error] = await to(checkMember(currentUserId, workspaceId));
  if (error) throw new Error("无权限");
  const { error: taskError } = await supabaseJebt
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("workspaceId", workspaceId)
    .eq("projectId", projectId);
  if (taskError) throw new Error("服务器错误");
  return true;
};

/**
 * 更新任务
 * @param param0
 * @returns
 */
export const updateJebtTask = async ({
  projectId,
  workspaceId,
  description,
  assigneeId,
  status,
  currentUserId,
  lastTime,
  id,
}: {
  name: string;
  projectId: string;
  workspaceId: string;
  description?: string;
  assigneeId: string;
  status: TaskStatus;
  lastTime: string;
  currentUserId: string;
  id: string;
}) => {
  const [error] = await to(checkUser(currentUserId, workspaceId));
  if (error) throw new Error("无权限");
  const { data, error: taskError } = await supabaseJebt
    .from("tasks")
    .update([
      {
        position: 1000,
        description,
        assigneeId,
        status,
        lastTime,
      },
    ])
    .eq("id", id)
    .eq("workspaceId", workspaceId)
    .eq("projectId", projectId)
    .select("*");
  if (taskError) throw new Error("服务器错误");
  return data;
};

/**
 * 根据id获取任务详情
 * @param param0
 * @returns
 */
export const getJebtTaskDetail = async ({
  id,
  workspaceId,
  projectId,
  currentUserId,
}: {
  id: string;
  workspaceId: string;
  projectId: string;
  currentUserId: string;
}) => {
  const [error] = await to(checkUser(currentUserId, workspaceId));
  if (error) throw new Error("无权限");
  const { data, error: taskError } = await supabaseJebt
    .from("tasks")
    .select("*")
    .eq("id", id)
    .eq("workspaceId", workspaceId)
    .eq("projectId", projectId);
  if (taskError) throw new Error("服务器错误");
  return data;
};
