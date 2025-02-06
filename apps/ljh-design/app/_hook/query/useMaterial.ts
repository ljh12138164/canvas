import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useQuery } from '@tanstack/react-query';
import type { InferResponseType } from 'hono';
type MaterialResponseType = InferResponseType<typeof client.material.material.$get, 200>;

/**
 * 获取素材
 * @returns
 */
export const useMaterial = () => {
  const { data, isLoading, isFetching } = useQuery<
    MaterialResponseType,
    Error,
    MaterialResponseType
  >({
    queryKey: ['material'],
    queryFn: async () => {
      const token = await getNewToken();
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
