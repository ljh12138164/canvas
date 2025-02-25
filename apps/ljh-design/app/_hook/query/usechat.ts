import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { PAGE_SIZE } from '@/app/_types/Edit';
import type { ChatMessage, MessageType } from '@/app/_types/chat';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';

export const useGetMessage = (workspaceId: string, isConnected: boolean) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    data: message,
    isLoading: messageLoading,
    error: messageError,
    hasNextPage: messageHasNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['chat', workspaceId],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        return;
      }
      if (isConnected) {
        // 获取当前的消息数量
        const pageTo = queryClient.getQueryData(['chat', workspaceId]) as {
          pageParams: number[];
          pages: {
            messages: {
              data: ChatMessage[];
              count: number;
              pageTo: number;
            };
          }[];
        };
        // 如果当前消息数量大于0，则获取下一页数据
        if (pageTo) {
          const allData = pageTo.pages.flatMap((page) => page.messages.data);
          const data = await client.chat.message.$get(
            {
              query: {
                workspaceId,
                pageTo: `${allData.length}`,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (!data.ok) throw new Error(data.statusText);
          return data.json();
        }
        // 如果当前消息数量为0，则获取第一页数据，初始化
        const data = await client.chat.message.$get(
          {
            query: {
              workspaceId,
              pageTo: '0',
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!data.ok) throw new Error(data.statusText);
        return data.json();
      }
      // 获取当前的消息数量
      const data = await client.chat.message.$get(
        {
          query: {
            workspaceId,
            pageTo: '0',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!data.ok) throw new Error(data.statusText);
      return data.json();
      // 如果没有websocket实例，则每秒请求一次，实现消息的实时性
    },
    // 如果没有websocket实例，则每秒请求一次，实现消息的实时性
    refetchInterval: isConnected ? false : 5000,
    // 初始化页数
    initialPageParam: 0,
    //判断是否有下一页
    getNextPageParam: (lastPage) => {
      if ((lastPage?.messages.count || 0) <= lastPage!.messages.pageTo) return undefined;
      return lastPage!.messages.pageTo + PAGE_SIZE;
    },
  });
  // 如果没有错误和有下一页，则预取下一页数据·
  if (messageHasNextPage && !messageError && message?.pageParams) {
    // 预取下一页数据
    queryClient.prefetchInfiniteQuery({
      queryKey: [workspaceId],
      queryFn: async () => {
        const token = await getNewToken();
        if (!token) {
          router.push('/sign-in');
          return;
        }
        const pageTo = queryClient.getQueryData(['chat', workspaceId]) as {
          pageParams: number[];
          pages: {
            messages: {
              data: ChatMessage[];
              count: number;
              pageTo: number;
            };
          }[];
        };
        const allData = pageTo.pages.flatMap((page) => page.messages.data);
        // 获取下一条数据
        const data = await client.chat.message.$get(
          {
            query: {
              workspaceId,
              pageTo: `${allData.length}`,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!data.ok) throw new Error(data.statusText);
        return data.json();
      },
      // @ts-ignore
      getNextPageParam: (lastPage: {
        messages: {
          data: {
            id: string;
            created_at: string;
            message: string;
            userId: string;
            workspaceId: string;
            type: MessageType;
          }[];
          count: number | null;
          pageTo: number;
        };
      }) => {
        if ((lastPage.messages.count || 0) <= lastPage.messages.pageTo) return undefined;
        return lastPage.messages.pageTo + PAGE_SIZE;
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
type AutoSaveResponseType = InferResponseType<(typeof client.chat)['send']['$post'], 200>;
type AutoSaveRequestType = InferRequestType<(typeof client.chat)['send']['$post']>;

/**
 * ## 创建消息
 */
export const useCreateMessage = () => {
  const router = useRouter();
  const { mutate: createMessage, isPending: messagePending } = useMutation<
    // TODO:类型错误
    any,
    Error,
    AutoSaveRequestType
  >({
    mutationFn: async (message) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        return;
      }
      const data = await client.chat.send.$post(message, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data.ok) throw new Error(data.statusText);
      return data.json();
    },
  });

  return { createMessage, messagePending };
};
