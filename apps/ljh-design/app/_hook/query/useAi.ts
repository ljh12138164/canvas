import { client, clientAi } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useUser } from '@/app/_store/auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
type UpdateRequestType = InferRequestType<typeof clientAi.chat.stream.$post>;
// ------------------调用ai 流式传输使用clinetAi --------------------------------
/**
 * ## 使用AI 聊天 stream
 */
export const useAi = () => {
  const { mutate: getAiStream, isPending: getAiStreamPending } = useMutation<
    ReadableStream<Buffer>,
    Error,
    UpdateRequestType
  >({
    mutationFn: async (datas) => {
      const response = await clientAi.chat.stream.$post(datas);
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.body as ReadableStream<Buffer>;
    },
  });
  return { getAiStream, getAiStreamPending };
};

type AiAnswerType = InferResponseType<typeof clientAi.chat.answer.$post>;
/**
 * ## 使用AI 聊天 非流式
 */
export const useAiAnswer = () => {
  const { mutate: getAiAnswer, isPending: getAiAnswerPending } = useMutation<
    AiAnswerType,
    Error,
    UpdateRequestType
  >({
    mutationFn: async (datas) => {
      const response = await clientAi.chat.answer.$post(datas);
      if (!response.ok) {
        const error = (await response.json()) as { result: string };
        throw new Error(error.result);
      }
      return response.json();
    },
  });
  return { getAiAnswer, getAiAnswerPending };
};

/**
 * ### 流式传输
 */
export const useAiChat = () => {
  const { mutate: getAiChat, isPending: getAiChatPending } = useMutation<
    ReadableStream<Buffer>,
    Error,
    UpdateRequestType
  >({
    mutationFn: async (datas) => {
      const response = await clientAi.chat.stream.$post(datas);
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.body as ReadableStream<Buffer>;
    },
  });
  return { getAiChat, getAiChatPending };
};
type AiImageRequestType = InferRequestType<typeof clientAi.image.imageStream.$post>;
/**
 * ### ai读图
 */
export const useAiImage = () => {
  const { mutate: getAiImage, isPending: getAiImagePending } = useMutation<
    ReadableStream<Buffer>,
    Error,
    AiImageRequestType
  >({
    mutationFn: async (datas) => {
      const response = await clientAi.image.imageStream.$post(datas);
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.body as ReadableStream<Buffer>;
    },
  });
  return { getAiImage, getAiImagePending };
};

//----------------------AI会话：使用clinet  --------------------------------
type AiSessionType = InferResponseType<typeof client.ai.create.$post, 200>;
type AiSessionRequestType = InferRequestType<typeof client.ai.create.$post>;
/**
 * ### 创建AI会话
 */
export const useAiSession = () => {
  const router = useRouter();
  const { mutate: createAiSession, isPending: createAiSessionPending } = useMutation<
    AiSessionType,
    Error,
    AiSessionRequestType
  >({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.ai.create.$post(datas, {
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
  return { createAiSession, createAiSessionPending };
};
type AiSessionListType = InferResponseType<typeof client.ai.chat.$get, 200>;
// type AiSessionListRequestType = InferRequestType<typeof client.ai.chat.$get>;
/**
 * ### 获取AI会话
 */
export const useAiSessionList = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data: getAiSessionList, isLoading: getAiSessionListLoading } = useQuery<
    AiSessionListType,
    Error,
    AiSessionListType
  >({
    queryKey: ['aiSessionList', user?.user.id],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.ai.chat.$get(undefined, {
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
  return { getAiSessionList, getAiSessionListLoading };
};
type AiSessionDeleteType = InferResponseType<typeof client.ai.chat.$delete>;
type AiSessionDeleteRequestType = InferRequestType<typeof client.ai.chat.$delete>;
/**
 * ### 删除AI会话
 */
export const useAiSessionDelete = () => {
  const router = useRouter();
  const { mutate: getAiSessionDelete, isPending: getAiSessionDeletePending } = useMutation<
    AiSessionDeleteType,
    Error,
    AiSessionDeleteRequestType
  >({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.ai.chat.$delete(datas, {
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
  return { getAiSessionDelete, getAiSessionDeletePending };
};

export type AiSessionDetailType = InferResponseType<typeof client.ai.history.$get, 200>;
/**
 * ### 获取AI会话详情
 */
export const useAiSessionDetail = (id: string) => {
  const router = useRouter();
  const { data: getAiSessionDetail, isLoading: getAiSessionDetailLoading } = useQuery<
    AiSessionDetailType,
    Error,
    AiSessionDetailType
  >({
    queryKey: ['aiSessionDetail', id],
    // 1小时后过期
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.ai.history.$get(
        { query: { id } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { getAiSessionDetail, getAiSessionDetailLoading };
};

type AiSessionUpdateType = InferResponseType<typeof client.ai.save.$post>;
type AiSessionUpdateRequestType = InferRequestType<typeof client.ai.save.$post>;
/**
 * ### 更新AI会话
 */
export const useAiSessionUpdate = () => {
  const router = useRouter();
  const { mutate: getAiSessionUpdate, isPending: getAiSessionUpdatePending } = useMutation<
    AiSessionUpdateType,
    Error,
    AiSessionUpdateRequestType
  >({
    mutationFn: async (datas) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }

      const response = await client.ai.save.$post(datas, {
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
  return { getAiSessionUpdate, getAiSessionUpdatePending };
};

/**
 * ### 使用AI生成Fabric.js对象配置
 */
type FabricRequestType = InferRequestType<typeof clientAi.design.fabric.$post>;
type FabricObject = {
  type: 'rect' | 'circle' | 'text' | 'image' | 'path' | 'polygon' | 'polyline' | 'ellipse';
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  flipX?: boolean;
  flipY?: boolean;
  radius?: number;
  rx?: number;
  ry?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  src?: string;
  path?: string;
  points?: Array<{ x: number; y: number }>;
};

// type FabricResponseType = {
//   objects: FabricObject[];
//   background?: string;
//   error?: string;
// };

/**
 * ### 使用AI生成Fabric.js对象配置（流式响应）
 */
export const useAiFabricStream = () => {
  const { mutate: getAiFabricStream, isPending: getAiFabricStreamPending } = useMutation<
    ReadableStream<Buffer>,
    Error,
    FabricRequestType
  >({
    mutationFn: async (datas) => {
      const response = await clientAi.design.fabric.$post(datas);
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.body as ReadableStream<Buffer>;
    },
  });

  return { getAiFabricStream, getAiFabricStreamPending };
};
