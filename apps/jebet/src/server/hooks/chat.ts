import { client } from '@/server/index';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { InferResponseType } from 'hono';

// type getMessageRequestType = InferRequestType<typeof client.chat.message.$get>;
type getMessageResponseType = InferResponseType<
  typeof client.chat.message.$get
>;

const PAGE_SIZE = 10;
export const useGetMessage = (
  workspaceId: string,
  userId: string,
  isConnected: boolean
) => {
  const queryClient = useQueryClient();
  const {
    data: message,
    isLoading: messageLoading,
    error: messageError,
    hasNextPage: messageHasNextPage,
    isFetchingNextPage: isFetchingNextPage,
    isFetchingPreviousPage: isFetchingPreviousPage,
    fetchNextPage: fetchNextPage,
    fetchPreviousPage: fetchPreviousPage,
  } = useInfiniteQuery({
    queryKey: [workspaceId],
    queryFn: async ({ pageParam }) => {
      const data = await client.chat.message.$get({
        query: {
          workspaceId,
          userId,
          page: pageParam + '',
        },
      });
      if (!data.ok) throw new Error(data.statusText);
      return data.json();
    },
    refetchInterval: !isConnected ? false : 1000,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.messages.count || 0 / PAGE_SIZE < lastPage.messages.page)
        return undefined;
      return lastPage.messages.page + 1;
    },
  });
  // 预取下一页数据
  if (messageHasNextPage && !messageError && message?.pageParams) {
    queryClient.prefetchInfiniteQuery({
      queryKey: [workspaceId],
      queryFn: async ({ pageParam }) => {
        const data = await client.chat.message.$get({
          query: {
            workspaceId,
            userId,
            page: pageParam + '',
          },
        });
        if (!data.ok) throw new Error(data.statusText);
        return data.json();
      },
      getNextPageParam: (lastPage: getMessageResponseType) => {
        if (typeof lastPage === 'string') return undefined;
        if (lastPage.messages.count || 0 / PAGE_SIZE < lastPage.messages.page)
          return undefined;
        return lastPage.messages.page + 1;
      },
      initialPageParam: 1,
    });
  }
  return {
    message,
    messageError,
    messageHasNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    messageLoading,
    fetchNextPage,
    fetchPreviousPage,
  };
};

/**
 * ## 创建消息
 */
export const useCreateMessage = (workspaceId: string, userId: string) => {
  const { mutate: createMessage, isPending: messagePending } = useMutation({
    mutationFn: async (message: string) => {
      const data = await client.chat.send.$post({
        json: { workspaceId, userId, message },
      });
      if (!data.ok) throw new Error(data.statusText);
      return data.json();
    },
  });

  return { createMessage, messagePending };
};
