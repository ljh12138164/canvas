import { useMutation, useQuery } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono/client';
import { client } from '..';
import { Flow } from '@/types/workspace';

/**
 * ## 获取文件夹信息
 */
export const useFlow = (workspaceId: string, userId: string) => {
  const {
    data: flows,
    isLoading: flowsLoading,
    error,
  } = useQuery({
    queryKey: ['flow', workspaceId],
    queryFn: async () => {
      const res = await client.flow.list.$get({
        query: { workspaceId, userId },
      });
      if (!res.ok) throw new Error(res.statusText);
      return res.json() as Promise<Flow[]>;
    },
  });
  return { flows, flowsLoading, error };
};

type CreateData = InferRequestType<(typeof client.flow.create)['$post']>;
type CreateResponse = InferResponseType<(typeof client.flow.create)['$post']>;
/**
 * ## 创建文件
 * @param data
 * @returns
 */
export const useCreateFlow = () => {
  const {
    mutate: create,
    isPending: createPending,
    error,
  } = useMutation<CreateResponse, Error, CreateData>({
    mutationFn: async (data) => {
      const res = await client.flow.create.$post({ form: data.form });
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });
  return { create, isLoading: createPending, error };
};

type DeleteData = InferRequestType<(typeof client.flow.delete)['$delete']>;
type DeleteResponse = InferResponseType<(typeof client.flow.delete)['$delete']>;
/**
 * ## 删除文件
 */
export const useDeleteFlow = () => {
  const {
    mutate: deleteFlow,
    isPending: deleteFlowPending,
    error,
  } = useMutation<DeleteResponse, Error, DeleteData>({
    mutationFn: async (data) => {
      const res = await client.flow.delete.$delete(data);
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });
  return { deleteFlow, deleteFlowPending, error };
};

type UpdateData = InferRequestType<(typeof client.flow.update)['$patch']>;
type UpdateResponse = InferResponseType<(typeof client.flow.update)['$patch']>;
/**
 * ## 更新文件
 */
export const useUpdateFlow = () => {
  const {
    mutate: update,
    isPending: updatePending,
    error,
  } = useMutation<UpdateResponse, Error, UpdateData>({
    mutationFn: async (data) => {
      const res = await client.flow.update.$patch(data);
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });
  return { update, updatePending, error };
};
