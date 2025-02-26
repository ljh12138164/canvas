import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useSocket } from '@/app/_store/chat';
import { PAGE_SIZE } from '@/app/_types/Edit';
import type { ChatMessage } from '@/app/_types/chat';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

type GetMessageResponseType = InferResponseType<(typeof client.chat.message)['$get'], 200>;
export const useGetMessage = (userId: string | undefined, sendId: string) => {
  const { socket } = useSocket();
  // 判断是否连接
  const isConnected = useMemo(() => socket?.connected, [socket?.connected]);
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
    queryKey: ['chat', userId, sendId],
    enabled: !!userId && !!sendId,
    queryFn: async () => {
      if (!userId) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }
      // 如果连接了，则获取当前的消息数量
      if (isConnected) {
        // 获取当前的消息数量
        const pageTo = queryClient.getQueryData(['chat', userId, sendId]) as {
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
                userId,
                sendId,
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
              userId,
              sendId,
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
            userId,
            sendId,
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
      if ((lastPage?.count || 0) <= lastPage!.pageTo) return undefined;
      return lastPage!.pageTo + PAGE_SIZE;
    },
  });
  // 如果没有错误和有下一页，则预取下一页数据·
  if (messageHasNextPage && !messageError && message?.pages[0].data.length) {
    // 预取下一页数据
    queryClient.prefetchInfiniteQuery({
      queryKey: ['chat', userId, sendId],
      queryFn: async () => {
        const token = await getNewToken();
        if (!token) {
          router.push('/sign-in');
          return;
        }
        const pageTo = queryClient.getQueryData(['chat', userId, sendId]) as {
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
              userId: userId!,
              sendId,
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
      getNextPageParam: (lastPage: GetMessageResponseType | undefined) => {
        if (!lastPage) return undefined;
        if ((lastPage.count || 0) <= lastPage.pageTo) return undefined;
        return lastPage.pageTo + PAGE_SIZE;
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
    AutoSaveResponseType,
    Error,
    AutoSaveRequestType
  >({
    mutationFn: async (message) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }
      const data = await client.chat.send.$post(message, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data.ok) {
        const error = (await data.json()) as { message: string };
        throw new Error(error.message);
      }
      return data.json();
    },
  });

  return { createMessage, messagePending };
};
