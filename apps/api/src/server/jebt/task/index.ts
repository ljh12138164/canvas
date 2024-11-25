import { PostgrestError } from "@supabase/supabase-js";
import to from "await-to-js";
import { supabaseJebt } from "../../../server/supabase/jebt";
import { TaskStatus, TaskWithWorkspace } from "../../../types/jebt/board";
import { checkMember } from "../board";

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
  lastTime: Date;
  currentUserId: string;
}) => {
  const [error] = await to(checkMember(currentUserId, workspaceId));
  if (error) throw new Error("无权限");
  const { data, error: taskError } = await supabaseJebt
    .from("tasks")
    .insert([
      {
        name,
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
  dueDate,
}: {
  currentUserId: string;
  workspaceId: string;
  projectId: string | null | undefined;
  search: string | null | undefined;
  status: TaskStatus | null | undefined;
  assigneeId: string | null | undefined;
  dueDate: string | null | undefined;
}) => {
  const [error] = await to(checkMember(currentUserId, workspaceId));
  if (error) throw new Error("无权限");
  const query = supabaseJebt
    .from("tasks")
    .select("*,workspace(*,member(*)),project(*)")
    .eq("workspaceId", workspaceId)
    .order("createdAt", { ascending: false });

  if (projectId) query.eq("projectId", projectId);
  if (status) query.eq("status", status);
  if (assigneeId) query.eq("assigneeId", assigneeId);
  if (dueDate) query.gte("dueDate", dueDate);
  if (search) query.textSearch("name", search);

  const { data, error: taskError } = (await query) as {
    data: TaskWithWorkspace[];
    error: PostgrestError | null;
  };
  if (taskError) throw new Error("服务器错误");
  return data;
};
