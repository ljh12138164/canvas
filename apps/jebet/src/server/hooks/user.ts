import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useNavigate } from 'react-router-dom';
import { client } from '..';
import { getNewToken } from '../../lib/sign';
// type GetJebtUserListRequestType = InferRequestType<
//   typeof client.user.list.$get
// >;
type GetJebtUserListResponseType = InferResponseType<typeof client.user.list.$get, 200>;
/**
 * 获取工作区成员
 */
export const useGetJebtUserList = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery<
    GetJebtUserListResponseType,
    Error,
    GetJebtUserListResponseType
  >({
    queryKey: ['userList', workspaceId],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.user.list.$get(
        {
          query: { workspaceId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw res.ok;
      return res.json();
    },
  });
  return { data, error, isLoading };
};

type SetJebtUserInfoResponseType = InferResponseType<typeof client.user.update.$post, 200>;
type SetJebtUserInfoRequestType = InferRequestType<typeof client.user.update.$post>;

/**
 * 设置用户信息
 */
export const useSetJebtUserInfo = () => {
  const navigate = useNavigate();
  const {
    mutate: newRoleData,
    error: newRoleError,
    isPending: newRoleIsPending,
  } = useMutation<SetJebtUserInfoResponseType, Error, SetJebtUserInfoRequestType>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.user.update.$post(
        {
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error('修改失败');
      return res.json();
    },
  });
  return { newRoleData, newRoleError, newRoleIsPending };
};

type DeleteJebtUserResponseType = InferResponseType<typeof client.user.delete.$delete, 200>;
type DeleteJebtUserRequestType = InferRequestType<typeof client.user.delete.$delete>;
/**
 * 删除用户或退出工作区
 */
export const useDeleteJebtUser = () => {
  const navigate = useNavigate();
  const {
    mutate: deleteData,
    error: deleteError,
    isPending: deleteIsPending,
  } = useMutation<DeleteJebtUserResponseType, Error, DeleteJebtUserRequestType>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.user.delete.$delete(
        {
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error('删除失败');
      return res.json();
    },
  });
  return { deleteData, deleteError, deleteIsPending };
};

/**
 * ## 获取用户信息
 */
export const useGetJebtUser = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await client.board.test.$get();
      return res.json();
    },
  });
  return { data, error, isLoading };
};
