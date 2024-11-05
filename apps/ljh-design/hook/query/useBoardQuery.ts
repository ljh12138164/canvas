import { client } from "@/api/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import toast from "react-hot-toast";
type ResponseType = InferResponseType<typeof client.api.board.$post>;
type RequestType = InferRequestType<typeof client.api.board.$post>["json"];
/**
 * 创建看板
 * @returns
 */
export const useBoardQuery = () => {
  const { data, isPending, error } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (board) => {
      const response = await client.api.board.$post({ json: board });
      if (!response.ok) throw new Error("创建失败");
      return response.json();
    },
    onSuccess: () => {
      toast.success("创建成功");
    },
    onError: () => {
      toast.error("创建失败");
    },
  });
  return { data, isPending, error };
};
