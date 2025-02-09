import { client } from '@/app/_database';
import { useMutation } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';

type RequestType = InferRequestType<typeof client.admin.login.$post>;
type ResponseType = InferResponseType<typeof client.admin.login.$post, 200>;
/**
 * ### 管理员登录
 * @returns 登录结果
 */
export const useAdmin = () => {
  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.admin.login.$post(data);
      if (!response.ok) throw new Error('登录失败');
      return response.json();
    },
  });
  return { mutate, isPending };
};
