import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useQuery } from '@tanstack/react-query';
import type { InferResponseType } from 'hono';
import { redirect } from 'next/navigation';

export type UserResponseType = InferResponseType<(typeof client.user.like)['$get'], 200>;
/**
 * ### 获取点赞
 * @returns
 */
export const useUserLike = (enabled: boolean) => {
  const { data: userLike, isLoading: userLikeLoading } = useQuery<
    UserResponseType,
    Error,
    UserResponseType
  >({
    queryKey: ['like'],
    enabled,
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const response = await client.user.like.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return await response.json();
    },
  });
  return { userLike, userLikeLoading };
};

export type UserCollectionResponseType = InferResponseType<
  (typeof client.user.collect)['$get'],
  200
>;

/**
 * ### 获取用户收藏
 *
 */
export const useUserCollection = (enabled: boolean) => {
  const { data: userCollection, isLoading: userCollectionLoading } = useQuery<
    UserCollectionResponseType,
    Error,
    UserCollectionResponseType
  >({
    queryKey: ['collection'],
    enabled,
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) redirect('/sign-in');
      const response = await client.user.collect.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return await response.json();
    },
  });
  return { userCollection, userCollectionLoading };
};
