import { client } from '@/database';
import { getNewToken } from '@/lib/sign';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { InferRequestType, InferResponseType } from 'hono/client';

type SubmitRequest = InferRequestType<(typeof client.submit)['form']['$post']>;
type SubmitResponse = InferResponseType<(typeof client.submit)['form']['$post'], 200>;
/**
 * @description 提交表单
 * @param inviteCode 邀请码
 * @returns 提交结果
 */
export const useSubmitBoard = () => {
  return useMutation<SubmitResponse, Error, SubmitRequest>({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      const data = await client.submit.form.$post(datas, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data.ok) throw new Error(data.statusText);
      const json = await data.json();
      return json;
    },
  });
};

/**
 * ## 获取我的提交
 * @param inviteCode 邀请码
 * @returns 提交结果
 */
export const useGetMySubmit = () => {
  return useQuery({
    queryKey: ['mySubmit'],
    queryFn: async () => {
      const token = await getNewToken();
      const data = await client.submit.mySubmit.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data.ok) throw new Error(data.statusText);
      return data.json();
    },
  });
};
// type MySubmitByIdRequest = InferRequestType<(typeof client.submit)['submit']['$get']>;
type MySubmitByIdResponse = InferResponseType<(typeof client.submit)['submit']['$get'], 200>;
/**
 * ### 根据id获取提交
 * @param id 提交id
 * @returns 提交结果
 */
export const useGetMySubmitById = (id: string) => {
  return useQuery<MySubmitByIdResponse, Error, MySubmitByIdResponse>({
    queryKey: ['mySubmitById', id],
    enabled: !!id,
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error instanceof Error && error.message.includes('404')) return false;
      return true;
    },
    queryFn: async () => {
      const token = await getNewToken();
      const data = await client.submit.submit.$get(
        { query: { id } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!data.ok) throw new Error(data.statusText);
      return data.json();
    },
  });
};
