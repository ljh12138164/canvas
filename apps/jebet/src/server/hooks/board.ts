import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import toast from 'react-hot-toast';
import { client } from '..';

/**
 * 创建工作区
 */
type RequestType = InferRequestType<typeof client.board.create.$post>;
type ResponseType = InferResponseType<typeof client.board.create.$post>;
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const { mutate: createWorkspace, isPending: isCreating } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (data) => {
      toast.loading('创建中');
      const workspace = await client.board.create.$post({
        form: data.form,
      });
      if (!workspace.ok) {
        toast.error('创建失败');
        throw new Error('创建失败');
      }

      return workspace.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', data.userId] });
      toast.dismiss();
      toast.success('创建成功');
    },
  });
  return { createWorkspace, isCreating };
};
/**
 *  ## 获取工作间
 */
export const useWorkspace = (id: string) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['workspace', id],
    queryFn: async () => {
      const res = await client.board[':id'].$get({
        param: { id },
      });
      if (!res.ok) {
        throw new Error('获取失败');
      }
      return res.json();
    },
  });
  return { isLoading, data, error };
};
type UpdateRequestType = InferRequestType<typeof client.board.update.$patch>;
type UpdateResponseType = InferResponseType<typeof client.board.update.$patch>;
/**
 * ## 更新工作区
 */
export const useUpdateWorkspace = () => {
  const { mutate: updateWorkspace, isPending: isUpdating } = useMutation<
    UpdateResponseType,
    Error,
    UpdateRequestType
  >({
    mutationFn: async (data) => {
      const res = await client.board.update.$patch({
        form: data.form,
      });
      if (!res.ok) {
        throw new Error('更新失败');
      }
      return res.json();
    },
  });
  return { updateWorkspace, isUpdating };
};

type DeleteRequestType = InferRequestType<
  (typeof client.board)[':id']['$delete']
>;
type DeleteResponseType = InferResponseType<
  (typeof client.board)[':id']['$delete']
>;
/**
 * ## 删除工作区
 */
export const useDeleteWorkspace = () => {
  const { mutate: deleteWorkspace, isPending: isDeleting } = useMutation<
    DeleteResponseType,
    Error,
    DeleteRequestType
  >({
    mutationFn: async (data) => {
      const res = await client.board[':id'].$delete({
        param: data.param,
        json: data.json,
      });
      if (!res.ok) {
        throw new Error('删除失败');
      }
      return res.json();
    },
  });
  return { deleteWorkspace, isDeleting };
};

type RefreshRequestType = InferRequestType<typeof client.board.refresh.$post>;
type RefreshResponseType = InferResponseType<typeof client.board.refresh.$post>;
/**
 * ## 刷新邀请码
 */
export const useRefreshWorkspace = () => {
  const { mutate: refreshWorkspace, isPending: isRefreshing } = useMutation<
    RefreshResponseType,
    Error,
    RefreshRequestType
  >({
    mutationFn: async (data) => {
      const res = await client.board.refresh.$post(data);
      if (!res.ok) {
        throw new Error('刷新失败');
      }
      return res.json();
    },
  });
  return { refreshWorkspace, isRefreshing };
};
