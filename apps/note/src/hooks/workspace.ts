import { toast } from '@/lib/index';
import { client } from '@/server';
import { getNewToken } from '@/server/sign';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'vue-router';

type createWorkspaceRequest = InferRequestType<typeof client.workspace.create.$post>;
type createWorkspaceResponse = InferResponseType<typeof client.workspace.create.$post, 200>;

/**
 *  创建工作区
 * @param token
 * @returns
 */
export const useCreateWorkspace = () => {
  const router = useRouter();

  const {
    isPending: createWorkspaceLoading,
    error: createWorkspaceError,
    mutate: createWorkspace,
  } = useMutation<createWorkspaceResponse, Error, createWorkspaceRequest>({
    mutationFn: async (newWorkspace) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.workspace.create.$post(newWorkspace, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return res.json();
    },
  });

  return { createWorkspaceLoading, createWorkspaceError, createWorkspace };
};

type getWorkspacesResponse = InferResponseType<typeof client.workspace.workspaces.$get, 200>;
/**
 * 获取工作区
 * @param token
 * @returns
 */
export const useGetWorkspaces = () => {
  const router = useRouter();

  const {
    data: workspaces,
    error: workspacesError,
    isLoading: workspacesIsLoading,
    isFetching: workspacesIsFetching,
  } = useQuery<getWorkspacesResponse, Error>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.workspace.workspaces.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return res.json();
    },
  });
  return {
    workspaces,
    workspacesError,
    workspacesIsLoading,
    workspacesIsFetching,
  };
};

export type getWorkspaceByIdResponse = InferResponseType<
  (typeof client.workspace.workspaces)[':workspaceId']['$get'],
  200
>;
// type getWorkspaceByIdRequest = InferRequestType<
//   (typeof client.workspace.workspaces)[':workspaceId']['$get']
// >;
/**
 * 获取工作区
 * @param id
 * @returns
 */
export const useGetWorkspaceById = (id: string) => {
  const router = useRouter();

  const {
    data: workspace,
    error: workspaceError,
    isFetching: workspaceIsFetching,
    isLoading: workspaceIsLoading,
  } = useQuery<getWorkspaceByIdResponse, Error, getWorkspaceByIdResponse>({
    queryKey: ['workspaceItem', id],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.workspace.workspaces[':workspaceId'].$get(
        { param: { workspaceId: id } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        if (error.message === '无权限') {
          toast.error('无权限');
          router.push('/workspace');
        }
        throw new Error(error.message);
      }
      return res.json();
    },
  });
  return { workspace, workspaceError, workspaceIsLoading, workspaceIsFetching };
};

type refreshInviteCodeRequest = InferRequestType<(typeof client.collaborators.refresh)['$post']>;
type refreshInviteCodeResponse = InferResponseType<
  (typeof client.collaborators.refresh)['$post'],
  200
>;
/**
 * 刷新邀请码
 * @param workspaceId
 * @returns
 */
export const useRefreshInviteCode = () => {
  const router = useRouter();
  const { mutate: refreshInviteCode, isPending: isRefreshing } = useMutation<
    refreshInviteCodeResponse,
    Error,
    refreshInviteCodeRequest
  >({
    mutationFn: async (workspaceId) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.collaborators.refresh.$post(workspaceId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return res.json();
    },
  });
  return { refreshInviteCode, isRefreshing };
};
