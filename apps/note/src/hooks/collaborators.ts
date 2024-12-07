import { client } from '@/server';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { InferRequestType, InferResponseType } from 'hono';

// type getCollaboratorsRequest = InferRequestType<
//   (typeof client.collaborators)[":workspaceId"]["$get"]
// >;
type getCollaboratorsResponse = InferResponseType<
  (typeof client.collaborators)[':workspaceId']['$get'],
  200
>;

/**
 * 获取协作者
 * @param workspaceId
 * @param token
 * @returns
 */
export const useCollaborators = (workspaceId: string, token: string) => {
  const { data: collaborators, isLoading } = useQuery<
    getCollaboratorsResponse,
    Error,
    getCollaboratorsResponse
  >({
    queryKey: ['collaborators'],
    queryFn: async () => {
      const res = await client.collaborators[':workspaceId'].$get(
        {
          param: { workspaceId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    },
  });
  return { collaborators, isLoading };
};

type inviteCollaboratorRequest = InferRequestType<
  (typeof client.collaborators)['invite']['$post']
>;
type inviteCollaboratorResponse = InferResponseType<
  (typeof client.collaborators)['invite']['$post']
>;
/**
 * 邀请协作者
 * @returns
 */
export const useInviteCollaborator = (token: string) => {
  const { mutate: inviteCollaborator, isPending: isInviting } = useMutation<
    inviteCollaboratorResponse,
    Error,
    inviteCollaboratorRequest
  >({
    mutationFn: async (data) => {
      const res = await client.collaborators.invite.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    },
  });
  return { inviteCollaborator, isInviting };
};

type removeCollaboratorRequest = InferRequestType<
  (typeof client.collaborators)['collaborators']['$delete']
>;
type removeCollaboratorResponse = InferResponseType<
  (typeof client.collaborators)['collaborators']['$delete']
>;
/**
 * 移除协作者
 * @param token
 * @returns
 */
export const useRemoveCollaborator = (token: string) => {
  const { mutate: removeCollaborator, isPending: isRemoving } = useMutation<
    removeCollaboratorResponse,
    Error,
    removeCollaboratorRequest
  >({
    mutationFn: async (data) => {
      const res = await client.collaborators.collaborators.$delete(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    },
  });
  return { removeCollaborator, isRemoving };
};
