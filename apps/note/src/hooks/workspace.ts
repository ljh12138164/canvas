import { client } from '@/server';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { InferRequestType, InferResponseType } from 'hono';

type createWorkspaceRequest = InferRequestType<
  typeof client.workspace.create.$post
>;
type createWorkspaceResponse = InferResponseType<
  typeof client.workspace.create.$post,
  200
>;

/**
 *  创建工作区
 * @param token
 * @returns
 */
export const useCreateWorkspace = (token: string) => {
  const {
    isPending: createWorkspaceLoading,
    error: createWorkspaceError,
    mutate: createWorkspace,
  } = useMutation<createWorkspaceResponse, Error, createWorkspaceRequest>({
    mutationFn: async (newWorkspace) => {
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

type getWorkspacesResponse = InferResponseType<
  typeof client.workspace.$get,
  200
>;
/**
 * 获取工作区
 * @param token
 * @returns
 */
export const useGetWorkspaces = (token: string) => {
  const {
    data: workspaces,
    error: workspacesError,
    isLoading: workspacesIsLoading,
    isFetching: workspacesIsFetching,
  } = useQuery<getWorkspacesResponse, Error>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const res = await client.workspace.$get(undefined, {
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

type getWorkspaceByIdResponse = InferResponseType<
  (typeof client.workspace)[':workspaceId']['$get'],
  200
>;
/**
 * 获取工作区
 * @param id
 * @returns
 */
export const useGetWorkspaceById = (token: string, id: string) => {
  const {
    data: workspace,
    error: workspaceError,
    isFetching: workspaceIsFetching,
    isLoading: workspaceIsLoading,
  } = useQuery<getWorkspaceByIdResponse, Error>({
    queryKey: ['workspaceItem'],
    queryFn: async () => {
      const res = await client.workspace[':workspaceId'].$get(
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
