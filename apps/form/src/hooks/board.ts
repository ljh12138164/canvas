import { client } from '@/database';
import { getNewToken } from '@/lib/sign';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { InferRequestType, InferResponseType } from 'hono/client';
import { useRouter } from 'vue-router';

const router = useRouter();
/**
 * @description 获取表单
 * @returns 表单
 */
export const useGetrBoard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['board'],
    queryFn: async () => {
      const token = await getNewToken();
      const data = await client.board.form.$get(undefined, {
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
  return { data, isLoading, error };
};

type CreateBoard = InferRequestType<typeof client.board.form.$post>;
type CreateBoardResponse = InferResponseType<typeof client.board.form.$post, 200>;
/**
 * ## 创建表单
 */
export const useCreateBoard = () => {
  return useMutation<CreateBoardResponse, Error, CreateBoard>({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      const data = await client.board.form.$post(datas, {
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
type GetBoardResponse = InferResponseType<(typeof client.board.form)[':id']['$get'], 200>;
/**
 * @description 获取表单详情
 * @param id 表单id
 * @returns 表单详情
 */
export const useBoard = (id: string) => {
  return useQuery<GetBoardResponse, Error>({
    queryKey: ['board', id],
    queryFn: async () => {
      const token = await getNewToken();
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
        throw new Error(error.message);
      }
      if (data.status === 404) router.back();
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
  return useMutation<UpdateBoardResponse, Error, UpdateBoard>({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      const data = await client.board.form.$patch(datas, {
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

type DeleteBoard = InferRequestType<typeof client.board.form.$delete>;
type DeleteBoardResponse = InferResponseType<typeof client.board.form.$delete, 200>;
/**
 * ### 删除表单
 * @param id 表单id
 * @returns 删除结果
 **/
export const useDeleteBoard = () => {
  return useMutation<DeleteBoardResponse, Error, DeleteBoard>({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      const data = await client.board.form.$delete(datas, {
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

type UpdateBoardInviteCode = InferRequestType<typeof client.board.update.$patch>;
type UpdateBoardInviteCodeResponse = InferResponseType<typeof client.board.update.$patch, 200>;
/**
 * @description 更新邀请码
 * @param id 表单id
 * @returns 更新结果
 */
export const useUpdateBoardInviteCode = () => {
  return useMutation<UpdateBoardInviteCodeResponse, Error, UpdateBoardInviteCode>({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      const data = await client.board.update.$patch(datas, {
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

type GetInviteCodeDataResponse = InferResponseType<
  (typeof client.board.submit)[':inviteCode']['$get'],
  200
>;

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
      const data = await client.board.submit[':inviteCode'].$get(
        { param: { inviteCode } },
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
      const json = await data.json();
      return json;
    },
  });
};
