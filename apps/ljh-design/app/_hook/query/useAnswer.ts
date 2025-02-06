import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';

type RequestType = InferRequestType<typeof client.answers.create.$post>;
type ResponseType = InferResponseType<typeof client.answers.create.$post>;
/**
 * ### 创建评论
 */
export const useAnswer = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const response = await client.answers.create.$post(data, {
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
export type GetAnswerResponseType = InferResponseType<typeof client.answers.comment.$get, 200>;
/**
 * ### 获取评论
 */
export const useGetAnswer = (id: string) => {
  const route = useRouter();
  const { data, isLoading } = useQuery<GetAnswerResponseType, Error, GetAnswerResponseType>({
    queryKey: ['answers', id],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) route.push('/sign-in');
      const response = await client.answers.comment.$get(
        { query: { id } },
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
  return { data, isLoading };
};
