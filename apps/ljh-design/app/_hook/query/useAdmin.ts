import { client } from '@/app/_database';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';

type RequestType = InferRequestType<typeof client.admin.login.$post>;
type ResponseType = InferResponseType<typeof client.admin.login.$post, 200>;
/**
 * ### 管理员登录
 * @returns 登录结果
 */
export const useAdmin = () => {
  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.admin.login.$post(data);
      if (!response.ok) throw new Error('登录失败');
      return response.json();
    },
  });
  return { mutate, isPending };
};

type ShowListResponseType = InferResponseType<typeof client.admin.show.$post, 200>;
/**
 * ### 获取话题统计
 * @returns 话题统计结果
 */
export const useShowList = (startDate: Date | undefined, endDate: Date | undefined) => {
  const router = useRouter();
  const { data, isPending } = useQuery<ShowListResponseType, Error, ShowListResponseType>({
    queryKey: ['ADMIN_SHOW_LIST', startDate, endDate],
    queryFn: async () => {
      const token = localStorage.getItem('ljh-admin-token');
      if (!token) router.push('/admin/login');
      const response = await client.admin.show.$post(
        { json: { startDate, endDate } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('获取话题统计失败');
      return response.json();
    },
  });
  return { data, isPending };
};

export type BoardListResponseType = InferResponseType<typeof client.admin.board.$post, 200>;
/**
 * ### 获取作品统计
 * @returns 作品统计结果
 */
export const useBoardList = (startDate: Date | undefined, endDate: Date | undefined) => {
  const router = useRouter();
  const { data, isPending } = useQuery<BoardListResponseType, Error, BoardListResponseType>({
    queryKey: ['ADMIN_BOARD_LIST', startDate, endDate],
    queryFn: async () => {
      const token = localStorage.getItem('ljh-admin-token');
      if (!token) router.push('/admin/login');
      const response = await client.admin.board.$post(
        { json: { startDate, endDate } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('获取作品统计失败');
      return response.json();
    },
  });
  return { data, isPending };
};

type MaterialListResponseType = InferResponseType<typeof client.admin.material.$post, 200>;
/**
 * ### 获取素材统计
 * @returns 素材统计结果
 */
export const useMaterialList = (startDate: Date | undefined, endDate: Date | undefined) => {
  const router = useRouter();
  const { data, isPending } = useQuery<MaterialListResponseType, Error, MaterialListResponseType>({
    queryKey: ['ADMIN_MATERIAL_LIST', startDate, endDate],
    queryFn: async () => {
      const token = localStorage.getItem('ljh-admin-token');
      if (!token) router.push('/admin/login');
      const response = await client.admin.material.$post(
        { json: { startDate, endDate } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('获取素材统计失败');
      return response.json();
    },
  });
  return { data, isPending };
};

type UpvotesListResponseType = InferResponseType<typeof client.admin.upvotes.$post, 200>;
/**
 * ### 获取点赞统计
 * @returns 点赞统计结果
 */
export const useUpvotesList = (startDate: Date | undefined, endDate: Date | undefined) => {
  const router = useRouter();
  const { data, isPending } = useQuery<UpvotesListResponseType, Error, UpvotesListResponseType>({
    queryKey: ['ADMIN_UPVOTES_LIST', startDate, endDate],
    queryFn: async () => {
      const token = localStorage.getItem('ljh-admin-token');
      if (!token) router.push('/admin/login');
      const response = await client.admin.upvotes.$post(
        { json: { startDate, endDate } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('获取点赞统计失败');
      return response.json();
    },
  });
  return { data, isPending };
};

type CollectionsListResponseType = InferResponseType<typeof client.admin.collections.$post, 200>;
/**
 * ### 获取收藏统计
 * @returns 收藏统计结果
 */
export const useCollectionsList = (startDate: Date | undefined, endDate: Date | undefined) => {
  const router = useRouter();
  const { data, isPending } = useQuery<
    CollectionsListResponseType,
    Error,
    CollectionsListResponseType
  >({
    queryKey: ['ADMIN_COLLECTIONS_LIST', startDate, endDate],
    queryFn: async () => {
      const token = localStorage.getItem('ljh-admin-token');
      if (!token) router.push('/admin/login');
      const response = await client.admin.collections.$post(
        { json: { startDate, endDate } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('获取收藏统计失败');
      return response.json();
    },
  });
  return { data, isPending };
};

type UserListResponseType = InferResponseType<typeof client.admin.user.$post, 200>;
/**
 * ### 获取用户统计
 * @returns 用户统计结果
 */
export const useUserList = (startDate: Date | undefined, endDate: Date | undefined) => {
  const router = useRouter();
  const { data, isPending } = useQuery<UserListResponseType, Error, UserListResponseType>({
    queryKey: ['ADMIN_USER_LIST', startDate, endDate],
    queryFn: async () => {
      const token = localStorage.getItem('ljh-admin-token');
      if (!token) router.push('/admin/login');
      const response = await client.admin.user.$post(
        { json: { startDate, endDate } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('获取用户统计失败');
      return response.json();
    },
  });
  return { data, isPending };
};

type UserDataListResponseType = InferResponseType<typeof client.admin.user.$post, 200>;
/**
 * ### 获取用户数据统计
 * @returns 用户数据统计结果
 */
export const useUserDataList = (startDate: Date | undefined, endDate: Date | undefined) => {
  const router = useRouter();
  const { data, isPending } = useQuery<UserDataListResponseType, Error, UserDataListResponseType>({
    queryKey: ['ADMIN_USER_DATA_LIST', startDate, endDate],
    queryFn: async () => {
      const token = localStorage.getItem('ljh-admin-token');
      if (!token) router.push('/admin/login');
      const response = await client.admin.user.$post(
        { json: { startDate, endDate } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('获取用户数据统计失败');
      return response.json();
    },
  });
  return { data, isPending };
};

type AiListResponseType = InferResponseType<typeof client.admin.ai.$post, 200>;
/**
 * ### 获取AI统计
 * @returns AI统计结果
 */
export const useAiList = (startDate: Date | undefined, endDate: Date | undefined) => {
  const router = useRouter();
  const { data, isPending } = useQuery<AiListResponseType, Error, AiListResponseType>({
    queryKey: ['ADMIN_AI_LIST', startDate, endDate],
    queryFn: async () => {
      const token = localStorage.getItem('ljh-admin-token');
      if (!token) router.push('/admin/login');
      const response = await client.admin.ai.$post(
        { json: { startDate, endDate } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('获取AI统计失败');
      return response.json();
    },
  });
  return { data, isPending };
};

export type DashboardListResponseType = InferResponseType<typeof client.admin.dashboard.$post, 200>;

/**
 * ### 获取仪表盘统计
 * @returns 仪表盘统计结果
 */
export const useDashboardList = (
  startDate: Date | undefined,
  endDate: Date | undefined,
  code?: number,
) => {
  const router = useRouter();
  const { data, isPending } = useQuery<DashboardListResponseType, Error, DashboardListResponseType>(
    {
      queryKey: ['ADMIN_DASHBOARD_LIST', startDate, endDate, code],
      queryFn: async () => {
        const token = localStorage.getItem('ljh-admin-token');
        if (!token) router.push('/admin/login');
        const response = await client.admin.dashboard.$post(
          { json: { startDate, endDate, code } },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) throw new Error('获取仪表盘统计失败');
        return response.json();
      },
    },
  );
  return { data, isPending };
};
