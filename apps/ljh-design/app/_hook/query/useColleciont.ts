import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useMutation } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono/client';
import { useRouter } from 'next/navigation';

export type GetCollectionResponseType = InferResponseType<
  (typeof client.collection.collection)['$post'],
  200
>;

type GetCollectionRequestType = InferRequestType<(typeof client.collection.collection)['$post']>;

/**
 * ### 收藏
 * @returns
 */
export const useCollection = () => {
  const { data: collectionData, isPending: collectionLoading } = useMutation<
    GetCollectionResponseType,
    Error,
    GetCollectionRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      const res = await client.collection.collection.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return await res.json();
    },
  });
  return { collectionData, collectionLoading };
};

type CancelCollectionRequestType = InferRequestType<(typeof client.collection.delte)['$delete']>;
type CancelCollectionResponseType = InferResponseType<
  (typeof client.collection.delte)['$delete'],
  200
>;
/**
 * ### 取消收藏
 * @returns
 */
export const useCancelCollection = () => {
  const router = useRouter();
  const { data: cancelCollectionData, isPending: cancelCollectionLoading } = useMutation<
    CancelCollectionResponseType,
    Error,
    CancelCollectionRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const res = await client.collection.delte.$delete(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return await res.json();
    },
  });
  return { cancelCollectionData, cancelCollectionLoading };
};

/**
 * ### 获取收藏
 * @returns
 */
// export const useGetCollection = () => {
//   const { data: getCollectionData, isLoading: getCollectionLoading } = useQuery<
//     GetCollectionResponseType,
//     Error,
//     GetCollectionResponseType
//   >({
//     queryKey: ['collection'],
//     queryFn: async () => {
//       const token = await getNewToken();
//       const res = await client.collection.collection.$post(data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     },
//   });
// };
