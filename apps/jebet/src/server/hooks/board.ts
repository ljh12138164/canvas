import userStore from '@/store/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { client } from '..';
import { getNewToken } from '../../lib/sign';

/**
 * 创建工作区
 */
type RequestType = InferRequestType<typeof client.board.create.$post>;
type ResponseTypeSucees = InferResponseType<typeof client.board.create.$post, 200>;
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: createWorkspace, isPending: isCreating } = useMutation<
    ResponseTypeSucees,
    Error,
    RequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      toast.loading('创建中');
      const workspace = await client.board.create.$post(
        {
          form: data.form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!workspace.ok) {
        toast.error('创建失败');
        throw new Error('创建失败');
      }

      return workspace.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace'] });
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

export type WorkspaceResponseType = InferResponseType<(typeof client.board.dashboard)['$get'], 200>;
/**
 *  ## 获取工作间
 */
export const useWorkspace = (id: string) => {
  const navigate = useNavigate();
  const { isLoading, data, error, isFetching } = useQuery<
    WorkspaceResponseType,
    Error,
    WorkspaceResponseType
  >({
    queryKey: ['workspace', id],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.board.dashboard.$get(
        {
          param: { id },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error('获取失败');
      const workspace = await res.json();

      userStore.setWorkspace(workspace);
      return workspace;
    },
  });
  return { isLoading, data, error, isFetching };
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

type DeleteRequestType = InferRequestType<(typeof client.board.dashboard)['$delete']>;
type DeleteResponseType = InferResponseType<(typeof client.board.dashboard)['$delete']>;
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
      const res = await client.board.dashboard.$delete(data);
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
type RefreshResponseSuccessType = InferResponseType<typeof client.board.refresh.$post, 200>;
/**
 * ## 刷新邀请码
 */
export const useRefreshWorkspace = () => {
  const navigate = useNavigate();
  const { mutate: refreshWorkspace, isPending: isRefreshing } = useMutation<
    RefreshResponseSuccessType,
    Error,
    RefreshRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.board.refresh.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
type JoinResponseSuccessType = InferResponseType<(typeof client.board.invite)['$get'], 200>;

/**
 * ## 根据邀请码获取工作区
 */
export const useJoinWorkspace = (id: string) => {
  const navigate = useNavigate();
  const { isLoading, data, error } = useQuery<
    JoinResponseSuccessType,
    Error,
    JoinResponseSuccessType
  >({
    queryKey: ['join', id],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.board.invite.$get(
        {
          param: { inviteCode: id },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error('获取失败');
      }
      return res.json();
    },
  });
  return { isLoading, data, error };
};

type UserJoinRequestType = InferRequestType<typeof client.board.join.$post>;
type UserJoinResponseSuccessType = InferResponseType<typeof client.board.join.$post, 200>;
/**
 * ## 加入工作区
 */
export const useUserJoinWorkspace = () => {
  const navigate = useNavigate();
  const { mutate: joinWorkspace, isPending: isJoining } = useMutation<
    UserJoinResponseSuccessType,
    Error,
    UserJoinRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.board.join.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('加入失败');
      }
      return res.json();
    },
  });
  return { joinWorkspace, isJoining };
};
