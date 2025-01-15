import { client } from '@/server/index';
import { Message, MessageType } from '@/types/chat';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
// import { InferResponseType } from 'hono';

// type getMessageRequestType = InferRequestType<typeof client.chat.message.$get>;
// type getMessageResponseType = InferResponseType<
//   typeof client.chat.message.$get
// >;

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
    queryFn: async () => {
      // 获取当前的消息数量
      const pageTo = queryClient.getQueryData([workspaceId]) as {
        pageParams: number[];
        pages: {
          messages: {
            data: Message[];
            count: number;
            pageTo: number;
          };
        }[];
      };
      // 如果当前消息数量大于0，则获取下一页数据
      if (pageTo) {
        const allData = pageTo.pages.map((page) => page.messages.data).flat();
        const data = await client.chat.message.$get({
          query: {
            workspaceId,
            userId,
            pageTo: allData.length + '',
          },
        });
        if (!data.ok) throw new Error(data.statusText);
        return data.json();
      } else {
        // 如果当前消息数量为0，则获取第一页数据，初始化
        const data = await client.chat.message.$get({
          query: {
            workspaceId,
            userId,
            pageTo: '0',
          },
        });
        if (!data.ok) throw new Error(data.statusText);
        return data.json();
      }
    },
    // 如果没有websocket实例，则每秒请求一次，实现消息的实时性
    refetchInterval: isConnected ? false : 5000,
    // 初始化页数
    initialPageParam: 0,
    //判断是否有下一页
    getNextPageParam: (lastPage) => {
      if ((lastPage.messages.count || 0) <= lastPage.messages.pageTo)
        return undefined;
      return lastPage.messages.pageTo + PAGE_SIZE;
    },
  });
  // 如果没有错误和有下一页，则预取下一页数据·
  if (messageHasNextPage && !messageError && message?.pageParams) {
    // 预取下一页数据
    queryClient.prefetchInfiniteQuery({
      queryKey: [workspaceId],
      queryFn: async () => {
        const pageTo = queryClient.getQueryData([workspaceId]) as {
          pageParams: number[];
          pages: {
            messages: {
              data: Message[];
              count: number;
              pageTo: number;
            };
          }[];
        };
        const allData = pageTo.pages.map((page) => page.messages.data).flat();
        // 获取下一条数据
        const data = await client.chat.message.$get({
          query: {
            workspaceId,
            userId,
            pageTo: allData.length + '',
          },
        });
        if (!data.ok) throw new Error(data.statusText);
        return data.json();
      },
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
        if ((lastPage.messages.count || 0) <= lastPage.messages.pageTo)
          return undefined;
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

/**
 * ## 上传图片
 */
export const useUploadImage = (workspaceId: string, userId: string) => {
  const { mutate: uploadImage, isPending: uploadImagePending } = useMutation({
    mutationFn: async (file: File) => {
      const data = await client.chat.file.$post({
        form: {
          workspaceId,
          userId,
          file,
        },
      });
      if (!data.ok) throw new Error(data.statusText);
      return data.json();
    },
  });
  return { uploadImage, uploadImagePending };
};
