import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useUser } from '@/app/_store/auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
export type MaterialResponseType = InferResponseType<typeof client.material.material.$get, 200>;

/**
 * 获取素材
 * @returns
 */
export const useMaterial = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading, isFetching } = useQuery<
    MaterialResponseType,
    Error,
    MaterialResponseType
  >({
    queryKey: ['material', user?.user.user_metadata.sub],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const response = await client.material.material.$get(undefined, {
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
  return { data, isLoading, isFetching };
};

type MaterialResponType = InferResponseType<typeof client.material.material.$post, 200>;
type MaterialRequestType = InferRequestType<typeof client.material.material.$post>;
/**
 * 获取素材
 * @returns
 */
export const useCreateMaterial = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation<MaterialResponType, Error, MaterialRequestType>({
    mutationFn: async (material) => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const response = await client.material.material.$post(material, {
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
  return { mutate, isPending };
};

type MaterialEditRequestType = InferRequestType<typeof client.material.material.$patch>;
type MaterialEditResponseType = InferResponseType<typeof client.material.material.$patch, 200>;
/**
 * ### 编辑素材
 * @returns
 */
export const useEditMaterial = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation<
    MaterialEditResponseType,
    Error,
    MaterialEditRequestType
  >({
    mutationFn: async (material) => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const response = await client.material.material.$patch(material, {
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
  return { mutate, isPending };
};
