import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import toast from "react-hot-toast";
import { client } from "..";

/**
 * 创建工作区
 */
type RequestType = InferRequestType<typeof client.board.create.$post>;
type ResponseType = InferResponseType<typeof client.board.create.$post>;
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const { mutate: createWorkspace, isPending: isCreating } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (data) => {
      toast.loading("创建中");
      const workspace = await client.board.create.$post({
        form: data.form,
      });
      if (!workspace.ok) {
        toast.error("创建失败");
        throw new Error("创建失败");
      }

      return workspace.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", data.userId] });
      toast.dismiss();
      toast.success("创建成功");
    },
  });
  return { createWorkspace, isCreating };
};
/**
 * 获取工作间
 */
export const useWorkspace = (id: string) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ["workspace", id],
    queryFn: async () => {
      const res = await client.board[":id"].$get({
        param: { id },
      });
      if (!res.ok) {
        throw new Error("获取失败");
      }
      return res.json();
    },
  });
  return { isLoading, data, error };
};
