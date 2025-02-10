import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useUser } from '@/app/_store/auth';
import { type EditType, PAGE_SIZE } from '@/app/_types/Edit';
import type { Board } from '@/app/_types/board';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { isArray } from 'lodash-es';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export type ResponseType = InferResponseType<typeof client.board.$post>;
type RequestType = InferRequestType<typeof client.board.$post>['json'];

type UpdateResponseType = InferResponseType<(typeof client.board)['editBoard']['$post']>;

type DeleteResponseType = InferResponseType<(typeof client.board)['deleteBoard']['$post']>;
type DeleteRequestType = InferRequestType<(typeof client.board)['deleteBoard']['$post']>;

type AutoSaveResponseType = InferResponseType<(typeof client.board)['save']['$post'], 200>;
type AutoSaveRequestType = InferRequestType<(typeof client.board)['save']['$post']>;

type CopyResponseType = InferResponseType<(typeof client.board)['clone']['$post']>;
type CopyRequestType = InferRequestType<(typeof client.board)['clone']['$post']>;
/**
 * 创建看板
 * @returns
 */
export const useBoardQuery = () => {
  const router = useRouter();
  const { mutate, isPending, error } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (board) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.board.$post(
        {
          json: board,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
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
export const useBoardEditQuery = ({ id, type }: { id: string | undefined; type: EditType }) => {
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading, error } = useQuery<Board[], Error, Board[]>({
    queryKey: ['project', id, user?.user.user_metadata.sub],
    // 如果id为undefined，则不查询
    enabled: !!id,
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.board.getBoard.$get(
        {
          query: { id: id!, type },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      if ((isArray(data) && data.length === 0) || !isArray(data)) {
        toast.dismiss();
        toast.error(`${type === 'board' ? '看板' : '模板'}不存在`);
        router.push('/board');
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
  const router = useRouter();
  const { data, isLoading, error, hasNextPage, isFetching, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['board', userId],
      queryFn: async ({ pageParam }) => {
        const token = await getNewToken();
        if (!token) {
          router.push('/sign-in');
          throw new Error('请先登录');
        }

        const response = await client.board.getBoard.$post(
          {
            json: { pageParam: pageParam as number },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          const error = (await response.json()) as { message: string };
          throw new Error(error.message);
        }
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
  const router = useRouter();
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
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.board.editBoard.$post(
        {
          json: { id, ...board },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
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
  const router = useRouter();
  const { mutate, isPending, error } = useMutation<DeleteResponseType, Error, DeleteRequestType>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.board.deleteBoard.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
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
export const useBoardAutoSaveQuery = ({ id }: { id: string | undefined }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation<
    AutoSaveResponseType,
    Error,
    AutoSaveRequestType
  >({
    mutationFn: async (board) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.board.save.$post(board, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: ['project', id] });
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
  const router = useRouter();
  const { mutate, isPending, error } = useMutation<CopyResponseType, Error, CopyRequestType>({
    mutationFn: async (board) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.board.clone.$post(
        {
          json: { ...board },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { mutate, isPending, error };
};

/**
 * 获取用户看板列表
 * @param token
 * @returns
 */
export const useBoardListQuery = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['boardList', user?.user.user_metadata.sub],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.board.getBoardList.$get(undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { data, isLoading, error, isFetching };
};
