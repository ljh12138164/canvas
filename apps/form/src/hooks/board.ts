import { client } from '@/database';
import { getNewToken } from '@/lib/sign';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { InferRequestType, InferResponseType } from 'hono/client';
import { useRouter } from 'vue-router';

/**
 * @description 获取表单
 * @returns 表单
 */
export const useGetrBoard = () => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ['board'],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const data = await client.board.form.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data.ok) {
        // @ts-ignore
        const error = (await data.json()) as { message: string };
        throw new Error(error.message);
      }
      return data.json();
    },
  });
  return { data, isLoading, error };
};

type CreateBoard = InferRequestType<typeof client.board.form.$post>;
type CreateBoardResponse = InferResponseType<typeof client.board.form.$post, 200>;
/**
 * ## 创建表单
 */
export const useCreateBoard = () => {
  const router = useRouter();
  return useMutation<CreateBoardResponse, Error, CreateBoard>({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const data = await client.board.form.$post(datas, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data.ok) {
        // @ts-ignore
        const error = (await data.json()) as { message: string };
        throw new Error(error.message);
      }
      return data.json();
    },
  });
};
type GetBoardResponse = InferResponseType<(typeof client.board.form)[':id']['$get'], 200>;
/**
 * @description 获取表单详情
 * @param id 表单id
 * @returns 表单详情
 */
export const useBoard = (id: string) => {
  const router = useRouter();
  return useQuery<GetBoardResponse, Error>({
    queryKey: ['board', id],
    retry: (failureCount, error) => {
      // 如果错误信息是 '未找到资源'，则不重试
      if (error.message === '未找到资源') return false;
      // 否则，重试3次
      return failureCount < 3;
    },
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const data = await client.board.form[':id'].$get(
        { param: { id } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!data.ok) {
        const error = (await data.json()) as { message: string };
        if (error.message === '未找到资源') router.back();
        throw new Error(error.message);
      }
      const json = await data.json();
      return json;
    },
  });
};

type UpdateBoard = InferRequestType<(typeof client.board.form)['$patch']>;
type UpdateBoardResponse = InferResponseType<(typeof client.board.form)['$patch'], 200>;
/**
 * @description 更新表单
 * @returns 更新结果
 */
export const useUpdateBoard = () => {
  const router = useRouter();
  return useMutation<UpdateBoardResponse, Error, UpdateBoard>({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const data = await client.board.form.$patch(datas, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data.ok) {
        const error = (await data.json()) as { message: string };
        throw new Error(error.message);
      }
      return data.json();
    },
  });
};

type DeleteBoard = InferRequestType<typeof client.board.form.$delete>;
type DeleteBoardResponse = InferResponseType<typeof client.board.form.$delete, 200>;
/**
 * ### 删除表单
 * @param id 表单id
 * @returns 删除结果
 **/
export const useDeleteBoard = () => {
  const router = useRouter();
  return useMutation<DeleteBoardResponse, Error, DeleteBoard>({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const data = await client.board.form.$delete(datas, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data.ok) {
        const error = (await data.json()) as { message: string };
        throw new Error(error.message);
      }
      return data.json();
    },
  });
};

type UpdateBoardInviteCode = InferRequestType<typeof client.board.update.$patch>;
type UpdateBoardInviteCodeResponse = InferResponseType<typeof client.board.update.$patch, 200>;
/**
 * @description 更新邀请码
 * @param id 表单id
 * @returns 更新结果
 */
export const useUpdateBoardInviteCode = () => {
  const router = useRouter();
  return useMutation<UpdateBoardInviteCodeResponse, Error, UpdateBoardInviteCode>({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const data = await client.board.update.$patch(datas, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data.ok) {
        const error = (await data.json()) as { message: string };
        throw new Error(error.message);
      }
      return data.json();
    },
  });
};

type GetInviteCodeDataResponse = InferResponseType<(typeof client.board.submit)['$get'], 200>;

/**
 * @description 获取邀请码数据
 * @param inviteCode 邀请码
 * @returns 邀请码数据
 */
export const useGetInviteCodeData = (inviteCode: string) => {
  return useQuery<GetInviteCodeDataResponse, Error>({
    queryKey: ['submit', inviteCode],
    queryFn: async () => {
      const token = await getNewToken();
      const data = await client.board.submit.$get(
        { query: { inviteCode } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!data.ok) {
        const error = (await data.json()) as { message: string };
        throw new Error(error.message);
      }

      return data.json();
    },
  });
};

type UpdateBoardSchema = InferRequestType<typeof client.board.shema.$patch>;
type UpdateBoardSchemaResponse = InferResponseType<typeof client.board.shema.$patch, 200>;
/**
 * @description 更新表单字段
 * @param id 表单id
 * @returns 更新结果
 */
export const useUpdateBoardSchema = () => {
  const router = useRouter();
  return useMutation<UpdateBoardSchemaResponse, Error, UpdateBoardSchema>({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const data = await client.board.shema.$patch(datas, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data.ok) {
        const error = (await data.json()) as { message: string };
        throw new Error(error.message);
      }
      return data.json();
    },
  });
};
