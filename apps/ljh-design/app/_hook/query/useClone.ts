import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useMutation } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';

type CopyResponseType = InferResponseType<(typeof client.board)['showClone']['$post']>;
type CopyRequestType = InferRequestType<(typeof client.board)['showClone']['$post']>;
export const useClone = () => {
  const router = useRouter();
  const { mutate } = useMutation<CopyResponseType, Error, CopyRequestType>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const res = await client.board.showClone.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('克隆失败');
      }
      return res.json();
    },
  });
  return { mutate };
};
