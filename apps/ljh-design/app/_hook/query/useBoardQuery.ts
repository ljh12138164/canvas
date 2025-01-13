import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { Board } from '@/app/_types/board';
import { PAGE_SIZE } from '@/app/_types/Edit';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { isArray } from 'lodash';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';

export type ResponseType = InferResponseType<typeof client.board.$post>;
type RequestType = InferRequestType<typeof client.board.$post>['json'];

type UpdateResponseType = InferResponseType<
  (typeof client.board)['editBoard']['$post']
>;

type DeleteResponseType = InferResponseType<
  (typeof client.board)['deleteBoard']['$post']
>;

type AutoSaveResponseType = InferResponseType<
  (typeof client.board)[':id']['$post'],
  200
>;
type AutoSaveRequestType = InferRequestType<
  (typeof client.board)[':id']['$post']
>['json'];

type CopyResponseType = InferResponseType<
  (typeof client.board)['clone']['$post']
>;
type CopyRequestType = InferRequestType<
  (typeof client.board)['clone']['$post']
>;
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
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const response = await client.board.$post(
        {
          json: board,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('创建失败');
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
export const useBoardEditQuery = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useQuery<Board[], Error, Board[]>({
    queryKey: ['project', id],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const response = await client.board[':id'].$get(
        {
          param: { id },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (
        !response.ok ||
        (isArray(data) && data.length === 0) ||
        !isArray(data)
      ) {
        toast.dismiss();
        toast.error('看板不存在');
        redirect('/board');
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
export const useBoardUserQuery = ({ userId }: { userId: string }) => {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['board', userId],
    queryFn: async ({ pageParam }) => {
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const response = await client.board.getBoard.$post(
        {
          json: { pageParam: pageParam as number },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('获取失败');
      return response.json();
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
export const useBoardUpdateQuery = ({ id }: { id: string }) => {
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
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const response = await client.board.editBoard.$post(
        {
          json: { id, ...board },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('更新失败');
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
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const response = await client.board.deleteBoard.$post(
        {
          json: { id },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('删除失败');
      return response.json();
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success('删除成功');
    },
    onError: () => {
      toast.dismiss();
      toast.error('删除失败');
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
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const response = await client.board[':id'].$post(
        {
          param: { id },
          json: { ...board },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('更新失败');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
  });
  return { mutate, isPending, error };
};

/**
 * 复制看板
 * @param id
 * @returns
 */
export const useBoardCopyQuery = () => {
  const { mutate, isPending, error } = useMutation<
    CopyResponseType,
    Error,
    CopyRequestType
  >({
    mutationFn: async (board) => {
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const response = await client.board.clone.$post(
        {
          json: { ...board },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('复制失败');
      return response.json();
    },
  });
  return { mutate, isPending, error };
};

/**
 * ## 获取用户图片
 * @param token
 * @returns
 */
export const useBoardImageQuery = ({ userId }: { userId: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['image', userId],
    enabled: !!userId,
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const response = await client.board.image.$post(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('获取失败');
      return response.json();
    },
  });
  return { data, isLoading, error };
};

/**
 * 获取用户看板列表
 * @param token
 * @returns
 */
export const useBoardListQuery = () => {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['boardList'],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const response = await client.board.getBoardList.$get(undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('获取失败');
      return response.json();
    },
  });
  return { data, isLoading, error, isFetching };
};
