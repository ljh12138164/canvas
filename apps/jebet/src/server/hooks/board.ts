import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import toast from 'react-hot-toast';
import { client } from '..';

/**
 * 创建工作区
 */
type RequestType = InferRequestType<typeof client.board.create.$post>;
type ResponseTypeSucees = InferResponseType<
  typeof client.board.create.$post,
  200
>;
export const useCreateWorkspace = (userId: string) => {
  const queryClient = useQueryClient();
  const { mutate: createWorkspace, isPending: isCreating } = useMutation<
    ResponseTypeSucees,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', userId] });
      toast.dismiss();
      toast.success('创建成功');
    },
    onError: () => {
      toast.dismiss();
      toast.error('创建失败');
    },
  });
  return { createWorkspace, isCreating };
};

export type WorkspaceResponseType = InferResponseType<
  (typeof client.board)[':id']['$get'],
  200
>;
/**
 *  ## 获取工作间
 */
export const useWorkspace = (id: string) => {
  const { isLoading, data, error } = useQuery<
    WorkspaceResponseType,
    Error,
    WorkspaceResponseType
  >({
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
// type RefreshResponseType = InferResponseType<typeof client.board.refresh.$post>;
type RefreshResponseSuccessType = InferResponseType<
  typeof client.board.refresh.$post,
  200
>;
/**
 * ## 刷新邀请码
 */
export const useRefreshWorkspace = () => {
  const { mutate: refreshWorkspace, isPending: isRefreshing } = useMutation<
    RefreshResponseSuccessType,
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

// type JoinResponseType = InferResponseType<
//   (typeof client.board.dashboard)[":inviteCode"]["$get"]
// >;
type JoinResponseSuccessType = InferResponseType<
  (typeof client.board.dashboard)[':inviteCode']['$get'],
  200
>;

/**
 * ## 根据邀请码获取工作区
 */
export const useJoinWorkspace = (id: string) => {
  const { isLoading, data, error } = useQuery<
    JoinResponseSuccessType,
    Error,
    JoinResponseSuccessType
  >({
    queryKey: ['join', id],
    queryFn: async () => {
      const res = await client.board.dashboard[':inviteCode'].$get({
        param: { inviteCode: id },
      });
      if (!res.ok) {
        throw new Error('获取失败');
      }
      return res.json();
    },
  });
  return { isLoading, data, error };
};

type UserJoinRequestType = InferRequestType<typeof client.board.join.$post>;
type UserJoinResponseSuccessType = InferResponseType<
  typeof client.board.join.$post,
  200
>;
/**
 * ## 加入工作区
 */
export const useUserJoinWorkspace = () => {
  const { mutate: joinWorkspace, isPending: isJoining } = useMutation<
    UserJoinResponseSuccessType,
    Error,
    UserJoinRequestType
  >({
    mutationFn: async (data) => {
      const res = await client.board.join.$post(data);
      if (!res.ok) {
        throw new Error('加入失败');
      }
      return res.json();
    },
  });
  return { joinWorkspace, isJoining };
};
