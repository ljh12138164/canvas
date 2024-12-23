import { useMutation, useQuery } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono/client';
import { client } from '..';
import { StoageData } from '@/types/workspace';

/**
 * ## 获取文件夹信息
 */
export const useStoages = (workspaceId: string, userId: string) => {
  const {
    data: stoages,
    isLoading: stoagesLoading,
    error,
  } = useQuery({
    queryKey: ['stoages', workspaceId],
    queryFn: async () => {
      const res = await client.storage.list.$get({
        query: { workspaceId, userId },
      });
      if (!res.ok) throw new Error(res.statusText);
      return res.json() as Promise<StoageData[]>;
    },
  });
  return { stoages, stoagesLoading, error };
};

type CreateData = InferRequestType<(typeof client.storage.create)['$post']>;
type CreateResponse = InferResponseType<
  (typeof client.storage.create)['$post']
>;
/**
 * ## 创建文件
 * @param data
 * @returns
 */
export const useCreateStoage = () => {
  const {
    mutate: create,
    isPending: createPending,
    error,
  } = useMutation<CreateResponse, Error, CreateData>({
    mutationFn: async (data) => {
      const res = await client.storage.create.$post({ form: data.form });
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });
  return { create, isLoading: createPending, error };
};

type DeleteData = InferRequestType<(typeof client.storage.delete)['$delete']>;
type DeleteResponse = InferResponseType<
  (typeof client.storage.delete)['$delete']
>;
/**
 * ## 删除文件
 */
export const useDeleteStoage = () => {
  const {
    mutate: deleteStoage,
    isPending: deleteStoagePending,
    error,
  } = useMutation<DeleteResponse, Error, DeleteData>({
    mutationFn: async (data) => {
      const res = await client.storage.delete.$delete(data);
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });
  return { deleteStoage, deleteStoagePending, error };
};

type UpdateData = InferRequestType<(typeof client.storage.update)['$patch']>;
type UpdateResponse = InferResponseType<
  (typeof client.storage.update)['$patch']
>;
/**
 * ## 更新文件
 */
export const useUpdateStoage = () => {
  const {
    mutate: update,
    isPending: updatePending,
    error,
  } = useMutation<UpdateResponse, Error, UpdateData>({
    mutationFn: async (data) => {
      const res = await client.storage.update.$patch(data);
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });
  return { update, updatePending, error };
};
