import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
/**
 * ### 获取推荐图片
 * @returns
 */
export const useImageQuery = () => {
  const {
    isLoading: getImageLoading,
    data: imageData,
    error: getImageError,
  } = useQuery({
    // 24小时后重新获取
    staleTime: 10000 * 60 * 60 * 24,
    queryKey: ['image'],
    queryFn: async () => {
      const response = await client.image.$get();
      if (!response.ok) {
        const error = (await response.json()) as { errors: string[] };
        throw new Error(error.errors.join('\n'));
      }
      const { data } = await response.json();
      return data;
    },
  });
  return {
    getImageLoading,
    imageData,
    getImageError,
  };
};

/**
 * ## 获取用户图片
 * @param userId
 * @returns
 * @returns
 */
export const useBoardImageQuery = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ['boardImage', userId],
    enabled: !!userId,
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const response = await client.image.userImage.$get(undefined, {
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
  return { data, isLoading, error };
};

type CreateResponseType = InferResponseType<(typeof client.image.userImage)['$post'], 200>;
type CreateRequestType = InferRequestType<(typeof client.image.userImage)['$post']>;
/**
 * ### 设置用户上传图片和收藏的图片
 * @param userId
 * @returns
 */
export const useUserImageQuery = () => {
  const router = useRouter();
  const { mutate, isPending, error } = useMutation<CreateResponseType, Error, CreateRequestType>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const response = await client.image.userImage.$post(data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { mutate, isPending, error };
};

type DeleteResponseType = InferResponseType<(typeof client.image.userImage)['$delete'], 200>;
type DeleteRequestType = InferRequestType<(typeof client.image.userImage)['$delete']>;
/**
 * ### 删除用户图片
 * @param userId
 * @returns
 */
export const useDeleteUserImageQuery = () => {
  const router = useRouter();
  const { mutate, isPending, error } = useMutation<DeleteResponseType, Error, DeleteRequestType>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const response = await client.image.userImage.$delete(data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { mutate, isPending, error };
};
