import { getNewToken } from '@/lib/sign';
import { useQuery } from '@tanstack/vue-query';
import type { InferResponseType } from 'hono/client';
import { useRouter } from 'vue-router';
import { client } from '../database';

export type GetDashboardDataResponse = InferResponseType<
  typeof client.dashboard.dashboard.$get,
  200
>;
/**
 * ### 获取仪表盘数据
 * @returns 仪表盘数据
 */
export const useGetDashboardData = () => {
  const router = useRouter();
  return useQuery<GetDashboardDataResponse, Error>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const data = await client.dashboard.dashboard.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data.ok) {
        const error = (await data.json()) as { message: string };
        throw new Error(error.message);
      }
      const json = await data.json();
      return json;
    },
  });
};
