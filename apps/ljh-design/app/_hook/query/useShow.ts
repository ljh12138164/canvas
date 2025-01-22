import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useMutation } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { redirect } from 'next/navigation';

type CreateResponseType = InferResponseType<(typeof client.formue.create)['$post']>;
type CreateRequestType = InferRequestType<(typeof client.formue.create)['$post']>;
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
      const res = await client.formue.create.$post(data, {
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
