import type { Flow } from '@/types/workspace';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono/client';
import { useNavigate } from 'react-router-dom';
import { client } from '..';
import { getNewToken } from '../../lib/sign';

/**
 * ## 获取文件夹信息
 */
export const useFlow = (workspaceId: string) => {
  const navigate = useNavigate();
  const {
    data: flows,
    isLoading: flowsLoading,
    error,
  } = useQuery({
    queryKey: ['flow', workspaceId],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.flow.list.$get(
        {
          query: { workspaceId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
  const navigate = useNavigate();
  const {
    mutate: create,
    isPending: createPending,
    error,
  } = useMutation<CreateResponse, Error, CreateData>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.flow.create.$post(
        { form: data.form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
  const navigate = useNavigate();
  const {
    mutate: deleteFlow,
    isPending: deleteFlowPending,
    error,
  } = useMutation<DeleteResponse, Error, DeleteData>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.flow.delete.$delete(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  const navigate = useNavigate();
  const {
    mutate: update,
    isPending: updatePending,
    error,
  } = useMutation<UpdateResponse, Error, UpdateData>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.flow.update.$patch(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });
  return { update, updatePending, error };
};
