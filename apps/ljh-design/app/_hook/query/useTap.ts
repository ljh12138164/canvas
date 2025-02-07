import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';

/***
 * ### 获取用户标签
 * @returns
 */
export const useGetTap = (userId: string) => {
  const {
    data: tapData,
    isLoading: tapLoading,
    error: tapError,
  } = useQuery({
    queryKey: ['tap', userId],
    queryFn: async () => {
      const token = await getNewToken();
      const response = await client.tap.userTap.$get(undefined, {
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
  return { tapData, tapLoading, tapError };
};

type CreateResponseType = InferResponseType<(typeof client.tap)['create']['$post'], 200>;
type CreateRequestType = InferRequestType<(typeof client.tap)['create']['$post']>;
/**
 * ### 创建标签
 * @param tag 标签
 * @param userId 用户id
 * @returns
 */
export const useCreateTap = () => {
  const { mutate: createTap, isPending: createTapPending } = useMutation<
    CreateResponseType,
    Error,
    CreateRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      const response = await client.tap.create.$post(data, {
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
  return { createTap, createTapPending };
};

type EditResponseType = InferResponseType<(typeof client.tap.edit)['$patch']>;
type EditRequestType = InferRequestType<(typeof client.tap.edit)['$patch']>;
/**
 * ### 编辑标签
 * @param id 标签id
 * @param tag 标签
 * @returns
 */
export const useEditTap = () => {
  const { mutate: editTap, isPending: editTapPending } = useMutation<
    EditResponseType,
    Error,
    EditRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      const response = await client.tap.edit.$patch(data, {
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
  return { editTap, editTapPending };
};

type DeleteResponseType = InferResponseType<(typeof client.tap.delete)['$delete']>;
type DeleteRequestType = InferRequestType<(typeof client.tap.delete)['$delete']>;
/**
 * ### 删除标签
 * @param id 标签id
 * @returns
 */
export const useDeleteTap = () => {
  const { mutate: deleteTap, isPending: deleteTapPending } = useMutation<
    DeleteResponseType,
    Error,
    DeleteRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      const response = await client.tap.delete.$delete(data, {
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
  return { deleteTap, deleteTapPending };
};
