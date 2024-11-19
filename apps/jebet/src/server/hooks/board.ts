import { useMutation } from "@tanstack/react-query";
import { client } from "..";
import { InferRequestType, InferResponseType } from "hono";
import toast from "react-hot-toast";
type RequestType = InferRequestType<typeof client.board.create.$post>["json"];
type ResponseType = InferResponseType<typeof client.board.create.$post>;
export const useCreateWorkspace = () => {
  const { mutate: createWorkspace, isPending: isCreating } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (data) => {
      const workspace = await client.board.create.$post({
        json: data,
      });
      if (!workspace.ok) {
        toast.error("创建失败");
        throw new Error("创建失败");
      }
      return workspace.json();
    },
    onSuccess: () => {
      toast.success("创建成功");
    },
  });
  return { createWorkspace, isCreating };
};
