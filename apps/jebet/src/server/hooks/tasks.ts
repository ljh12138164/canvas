import { client } from "@/server";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type CreateTaskInput = InferRequestType<typeof client.task.create.$post>;
type CreateTaskOutput = InferResponseType<typeof client.task.create.$post, 200>;
/**
 * ## 生成task
 *
 */
export const useCreateTask = () => {
  const { mutate: createTask, isPending: createTaskLoading } = useMutation<
    CreateTaskOutput,
    Error,
    CreateTaskInput
  >({
    mutationFn: async (data) => {
      const res = await client.task.create.$post(data);
      if (!res.ok) {
        throw new Error("创建任务失败");
      }
      return res.json();
    },
  });
  return { createTask, createTaskLoading };
};

type GetTaskListInput = InferRequestType<typeof client.task.get.$get>["query"];
type GetTaskListOutput = InferResponseType<typeof client.task.get.$get, 200>;
/**
 * ## 获取任务列表
 *
 */
export const useGetTaskList = ({
  workspaceId,
  projectId,
  currentUserId,
  status,
  search,
  lastTime,
  assigneeId,
}: GetTaskListInput) => {
  const { data, isLoading, isFetching } = useQuery<
    GetTaskListOutput,
    Error,
    GetTaskListInput
  >({
    queryKey: ["taskList"],
    queryFn: async () => {
      const res = await client.task.get.$get({
        query: {
          workspaceId: workspaceId,
          projectId: projectId,
          currentUserId: currentUserId,
          status: status,
          search: search,
          lastTime: lastTime,
          assigneeId: assigneeId,
        },
      });
      if (!res.ok) {
        throw new Error("获取任务列表失败");
      }
      return res.json();
    },
  });
  return { data, isLoading, isFetching };
};
