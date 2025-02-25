import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useUser } from '@/app/_store/auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono/client';
import { useRouter } from 'next/navigation';

export type GetFriendListResponseType = InferResponseType<
  (typeof client.friend.friendList)['$get'],
  200
>;
/**
 * ### 获取好友列表
 * @returns
 */
export const useFrident = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading, error } = useQuery<GetFriendListResponseType, Error>({
    queryKey: ['frident', user?.user.id],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }
      const response = await client.friend.friendList.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('获取好友列表失败');
      }
      return response.json();
    },
  });
  return { data, isLoading, error };
};

type AddFriendResponseType = InferResponseType<(typeof client.friend.friend)['$post'], 200>;
type AddFriendRequestType = InferRequestType<(typeof client.friend.friend)['$post']>;

/**
 * ### 添加好友
 * @returns
 */
export const useAddFriend = () => {
  const router = useRouter();
  const { mutate: addFriendMutate, isPending: addFriendLoading } = useMutation<
    AddFriendResponseType,
    Error,
    AddFriendRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }
      const response = await client.friend.friend.$post(data, {
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
  });
  return { addFriendMutate, addFriendLoading };
};

type SearchFriendResponseType = InferResponseType<(typeof client.friend.searchFriend)['$get'], 200>;
// type SearchFriendRequestType = InferRequestType<(typeof client.friend.searchFriend)['$get']>;
/***
 * ### 搜索好友
 * @returns
 */
export const useSearchFriend = (search: string) => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery<SearchFriendResponseType, Error>({
    queryKey: ['searchFriend', search],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }
      const response = await client.friend.searchFriend.$get(
        {
          query: {
            search,
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
      return response.json();
    },
  });
  return { data, isLoading, error };
};

type AddFridentResponseType = InferResponseType<(typeof client.friend.add)['$post'], 200>;
type AddFridentRequestType = InferRequestType<(typeof client.friend.add)['$post']>;
/**
 * ### 同意添加好友
 * @returns
 */
export const useAddFrident = () => {
  const router = useRouter();
  const { mutate: addFridentMutate, isPending: addFridentLoading } = useMutation<
    AddFridentResponseType,
    Error,
    AddFridentRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }
      const response = await client.friend.add.$post(data, {
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
  });
  return { addFridentMutate, addFridentLoading };
};
