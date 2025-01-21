import { client } from '@/server';
import { getNewToken } from '@/server/sign';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'vue-router';

const router = useRouter();
type createWorkspaceRequest = InferRequestType<typeof client.workspace.create.$post>;
type createWorkspaceResponse = InferResponseType<typeof client.workspace.create.$post, 200>;

/**
 *  创建工作区
 * @param token
 * @returns
 */
export const useCreateWorkspace = () => {
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
      if (!res.ok) throw new Error(res.statusText);
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
      if (!res.ok) throw new Error(res.statusText);
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

export type getWorkspaceByIdResponse = InferResponseType<(typeof client.workspace.workspaces)[':workspaceId']['$get'], 200>;
// type getWorkspaceByIdRequest = InferRequestType<
//   (typeof client.workspace.workspaces)[':workspaceId']['$get']
// >;
/**
 * 获取工作区
 * @param id
 * @returns
 */
export const useGetWorkspaceById = (id: string) => {
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
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });
  return { workspace, workspaceError, workspaceIsLoading, workspaceIsFetching };
};
