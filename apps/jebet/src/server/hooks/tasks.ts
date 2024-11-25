import { client } from "@/server";
import { useMutation } from "@tanstack/react-query";
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
