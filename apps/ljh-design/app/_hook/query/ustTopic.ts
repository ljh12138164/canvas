import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';

/***
 * ### 获取用户话题
 * @returns
 */
export const useGetTopic = (userId: string) => {
  const {
    data: topicData,
    isLoading: topicLoading,
    error: topicError,
  } = useQuery({
    queryKey: ['topic', userId],
    queryFn: async () => {
      const token = await getNewToken();
      const response = await client.topic.userTopic.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { topicData, topicLoading, topicError };
};

type EditResponseType = InferResponseType<(typeof client.topic.edit)['$post']>;
type EditRequestType = InferRequestType<(typeof client.topic.edit)['$post']>;
/**
 * ### 编辑话题
 * @param id 话题id
 * @param name 话题名称
 * @param explanation 话题描述
 * @returns
 */
export const useEditTopic = () => {
  const { mutate: editTopic, isPending: editTopicPending } = useMutation<
    EditResponseType,
    Error,
    EditRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      const response = await client.topic.edit.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { editTopic, editTopicPending };
};

type DeleteResponseType = InferResponseType<(typeof client.topic.delete)['$post']>;
type DeleteRequestType = InferRequestType<(typeof client.topic.delete)['$post']>;
/**
 * ### 删除话题
 * @param id 话题id
 * @returns
 */
export const useDeleteTopic = () => {
  const { mutate: deleteTopic, isPending: deleteTopicPending } = useMutation<
    DeleteResponseType,
    Error,
    DeleteRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      const response = await client.topic.delete.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { deleteTopic, deleteTopicPending };
};
