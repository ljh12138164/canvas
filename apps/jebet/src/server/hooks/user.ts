import { useMutation, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "..";

// type GetJebtUserListRequestType = InferRequestType<
//   typeof client.user.list.$get
// >;
type GetJebtUserListResponseType = InferResponseType<
  typeof client.user.list.$get,
  200
>;
/**
 * 获取工作区成员
 */
export const useGetJebtUserList = ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}) => {
  const { data, error, isLoading } = useQuery<
    GetJebtUserListResponseType,
    Error,
    GetJebtUserListResponseType
  >({
    queryKey: ["userList", workspaceId],
    queryFn: async () => {
      const res = await client.user.list.$get({
        query: { workspaceId, userId },
      });
      if (!res.ok) throw res.ok;
      return res.json();
    },
  });
  return { data, error, isLoading };
};

type SetJebtUserInfoResponseType = InferResponseType<
  typeof client.user.update.$post,
  200
>;
type SetJebtUserInfoRequestType = InferRequestType<
  typeof client.user.update.$post
>;

/**
 * 设置用户信息
 */
export const useSetJebtUserInfo = () => {
  const {
    mutate: newRoleData,
    error: newRoleError,
    isPending: newRoleIsPending,
  } = useMutation<
    SetJebtUserInfoResponseType,
    Error,
    SetJebtUserInfoRequestType
  >({
    mutationFn: async (data) => {
      const res = await client.user.update.$post({
        ...data,
      });
      if (!res.ok) throw new Error("修改失败");
      return res.json();
    },
  });
  return { newRoleData, newRoleError, newRoleIsPending };
};

type DeleteJebtUserResponseType = InferResponseType<
  typeof client.user.delete.$delete,
  200
>;
type DeleteJebtUserRequestType = InferRequestType<
  typeof client.user.delete.$delete
>;
/**
 * 删除用户或退出工作区
 */
export const useDeleteJebtUser = () => {
  const {
    mutate: deleteData,
    error: deleteError,
    isPending: deleteIsPending,
  } = useMutation<DeleteJebtUserResponseType, Error, DeleteJebtUserRequestType>(
    {
      mutationFn: async (data) => {
        const res = await client.user.delete.$delete({
          ...data,
        });
        if (!res.ok) throw new Error("删除失败");
        return res.json();
      },
    }
  );
  return { deleteData, deleteError, deleteIsPending };
};
