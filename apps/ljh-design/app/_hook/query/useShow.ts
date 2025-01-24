import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { redirect, useSearchParams } from 'next/navigation';

const LIMIT = 10;

type CreateResponseType = InferResponseType<(typeof client.show.create)['$post'], 200>;
type CreateRequestType = InferRequestType<(typeof client.show.create)['$post']>;
/**
 * ### 创建评论
 */
export const useShow = () => {
  const { mutate: createShow, isPending: createShowPending } = useMutation<
    CreateResponseType,
    Error,
    CreateRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const res = await client.show.create.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return res.json();
    },
  });
  return { createShow, createShowPending };
};

export type GetFormueResponseType = InferResponseType<
  (typeof client.showPublic.getRandom)['$get'],
  200
>;
/**
 * ### 获取设计论坛
 * @param params 查询参数
 * @returns 设计论坛
 */
export const useGetFormue = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const {
    data: formueData,
    isLoading: formueLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['formue', search ?? ''],
    queryFn: async ({ pageParam }) => {
      const res = await client.showPublic.getRandom.$get({
        // @ts-ignore
        query: { tap: search || '', page: pageParam },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return await res.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return Math.ceil(lastPage.count / LIMIT) > pages.length ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
  return { formueData, formueLoading, fetchNextPage, isFetchingNextPage, hasNextPage };
};

export type GetShowResponseType = InferResponseType<(typeof client.showPublic.get)['$get'], 200>;
/**
 * ### 获取展示
 * @param id 展示id
 * @returns 展示
 */
export const useGetShow = (id: string) => {
  const { data: showData, isLoading: showLoading } = useQuery<
    GetShowResponseType,
    Error,
    GetShowResponseType
  >({
    queryKey: ['show', id],
    queryFn: async () => {
      const token = await getNewToken();
      const res = await client.showPublic.get.$get(
        { query: { id } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return await res.json();
    },
  });
  return { showData, showLoading };
};