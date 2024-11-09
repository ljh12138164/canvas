import { client } from "@/api/hono";
import { Board, BoardResponse } from "@/types/board";
import { PAGE_SIZE } from "@/types/Edit";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { isArray } from "lodash";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export type ResponseType = InferResponseType<typeof client.api.board.$post>;
type RequestType = InferRequestType<typeof client.api.board.$post>["json"];

type UpdateResponseType = InferResponseType<
  (typeof client.api.board)["editBoard"]["$post"]
>;

type DeleteResponseType = InferResponseType<
  (typeof client.api.board)["deleteBoard"]["$post"]
>;

type AutoSaveResponseType = InferResponseType<
  (typeof client.api.board)[":id"]["$patch"],
  200
>;
type AutoSaveRequestType = InferRequestType<
  (typeof client.api.board)[":id"]["$patch"]
>["json"];

/**
 * 创建看板
 * @returns
 */
export const useBoardQuery = () => {
  const { mutate, isPending, error } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (board) => {
      const response = await client.api.board.$post({ json: board });
      if (!response.ok) throw new Error("创建失败");
      return response.json();
    },
  });
  return { mutate, isPending, error };
};
/**
 * 编辑器画布
 * @param id
 * @returns
 */
export const useBoardEditQuery = ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery<Board[], Error, Board[]>({
    queryKey: [id],
    queryFn: async () => {
      const response = await client.api.board[":id"].$get({
        param: { id },
        query: { userId },
      });
      const data = await response.json();
      if (
        !response.ok ||
        (isArray(data) && data.length === 0) ||
        !isArray(data)
      ) {
        toast.dismiss();
        toast.error("看板不存在");
        router.push("/board");
      }
      return data as Board[];
    },
  });
  return { data, isLoading, error };
};
/**
 * 获取用户看板
 * @param userid
 * @returns
 */
export const useBoardUserQuery = ({ userid }: { userid: string }) => {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<BoardResponse[], Error>({
    queryKey: [userid],
    queryFn: async ({ pageParam }) => {
      const response = await client.api.board.getBoard.$post({
        json: { userid, pageParam: pageParam as number },
      });
      if (!response.ok) throw new Error("获取失败");
      const data = await response.json();
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) return undefined;
      if (lastPage[0].count / PAGE_SIZE > pages.length) return pages.length;
      return undefined;
    },
  });
  return {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  };
};

/**
 * 更新看板
 * @param id
 * @returns
 */
export const useBoardUpdateQuery = (id: string) => {
  const { mutate, isPending, error } = useMutation<
    UpdateResponseType,
    Error,
    {
      name: string;
      width: number;
      height: number;
    }
  >({
    mutationFn: async (board) => {
      const response = await client.api.board.editBoard.$post({
        json: { id, ...board },
      });
      if (!response.ok) throw new Error("更新失败");
      return response.json();
    },
  });
  return { mutate, isPending, error };
};
/**
 * 删除看板
 * @param id
 * @returns
 */
export const useBoardDeleteQuery = () => {
  const { mutate, isPending, error } = useMutation<
    DeleteResponseType,
    Error,
    { id: string }
  >({
    mutationFn: async ({ id }) => {
      const response = await client.api.board.deleteBoard.$post({
        json: { id },
      });
      if (!response.ok) throw new Error("删除失败");
      return response.json();
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("删除成功");
    },
    onError: () => {
      toast.dismiss();
      toast.error("删除失败");
    },
  });
  return { mutate, isPending, error };
};

/**
 * 自动保存看板
 * @param id
 * @returns
 */
export const useBoardAutoSaveQuery = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation<
    AutoSaveResponseType,
    Error,
    AutoSaveRequestType
  >({
    mutationFn: async (board) => {
      const response = await client.api.board[":id"].$patch({
        param: { id },
        json: { ...board },
      });
      if (!response.ok) throw new Error("更新失败");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [id] });
    },
  });
  return { mutate, isPending, error };
};