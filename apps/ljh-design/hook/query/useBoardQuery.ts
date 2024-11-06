import { client } from "@/api/hono";
import { Board } from "@/types/board";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { isArray } from "lodash";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
type ResponseType = InferResponseType<typeof client.api.board.$post>;
type RequestType = InferRequestType<typeof client.api.board.$post>["json"];

type EditResponseType = InferResponseType<
  (typeof client.api.board)[":id"]["$get"]
>;
type EditRequestType = InferRequestType<
  (typeof client.api.board)[":id"]["$get"]
>;
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
/**
 * 编辑器画布
 * @param id
 * @returns
 */
export const useBoardEditQuery = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery<
    EditResponseType,
    Error,
    EditRequestType
  >({
    queryKey: [id],
    queryFn: async () => {
      const response = await client.api.board[":id"].$get({ param: { id } });
      const data = await response.json();
      if (
        response.status === 400 ||
        (isArray(data) && data.length === 0) ||
        !response.ok
      ) {
        toast.dismiss();
        toast.error("看板不存在");
        router.push("/board");
      }
      return data;
    },
  });
  return { data, isLoading, error };
};
/**
 *
 */
export const useBoardUserQuery = ({ userid }: { userid: string }) => {
  const { data, isLoading, error } = useQuery<Board[], Error>({
    queryKey: [userid],
    queryFn: async () => {
      const response = await client.api.board[":userid"].$get({
        param: { userid },
      });
      const data = await response.json();
      if (!response.ok) {
        toast.dismiss();
        toast.error("获取失败,重试中...");
        throw new Error("获取失败");
      }
      if (Array.isArray(data)) return data;
      throw new Error("获取失败");
    },
  });
  return { data, isLoading, error };
};
