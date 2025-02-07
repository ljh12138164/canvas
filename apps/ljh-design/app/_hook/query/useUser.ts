import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useQuery } from '@tanstack/react-query';
import type { InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';

export type UserResponseType = InferResponseType<(typeof client.user.like)['$get'], 200>;
/**
 * ### 获取点赞
 * @returns
 */
export const useUserLike = (enabled: boolean, search: string) => {
  const router = useRouter();
  const { data: userLike, isLoading: userLikeLoading } = useQuery<
    UserResponseType,
    Error,
    UserResponseType
  >({
    queryKey: ['like', search],
    enabled,
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const response = await client.user.like.$get(
        { query: { search } },
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
export const useUserCollection = (enabled: boolean, search: string) => {
  const router = useRouter();
  const { data: userCollection, isLoading: userCollectionLoading } = useQuery<
    UserCollectionResponseType,
    Error,
    UserCollectionResponseType
  >({
    queryKey: ['collection', search],
    enabled,
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const response = await client.user.collect.$get(
        { query: { search } },
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
      return await response.json();
    },
  });
  return { userCollection, userCollectionLoading };
};

export type UserDataResponseType = InferResponseType<(typeof client.user.data)['$get'], 200>;

/**
 * ### 获取用户的所有数据进行统计和图标显示
 * @param param0
 * @returns
 */
export const useUserData = (enabled: boolean, startTime?: Date, endTime?: Date) => {
  const router = useRouter();
  const { data: userData, isLoading: userDataLoading } = useQuery<
    UserDataResponseType,
    Error,
    UserDataResponseType
  >({
    queryKey: ['userData', startTime, endTime],
    enabled,
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const response = await client.user.data.$get(
        {
          query: {
            startTime: startTime?.toISOString() ?? undefined,
            endTime: endTime?.toISOString() ?? undefined,
          },
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
      return await response.json();
    },
  });
  return { userData, userDataLoading };
};
