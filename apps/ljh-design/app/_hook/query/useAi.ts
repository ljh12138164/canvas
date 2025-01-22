import { clientAi } from '@/app/_database';
import { useMutation } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
type UpdateRequestType = InferRequestType<typeof clientAi.chat.stream.$post>;
/**
 * ## 使用AI 聊天 stream
 */
export const useAi = () => {
  const { mutate: getAiStream, isPending: getAiStreamPending } = useMutation<ReadableStream<Buffer>, Error, UpdateRequestType>({
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
  const { mutate: getAiAnswer, isPending: getAiAnswerPending } = useMutation<AiAnswerType, Error, UpdateRequestType>({
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
  const { mutate: getAiChat, isPending: getAiChatPending } = useMutation<ReadableStream<Buffer>, Error, UpdateRequestType>({
    mutationFn: async (datas) => {
      const response = await clientAi.chat.chat.$post(datas);
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.body as ReadableStream<Buffer>;
    },
  });
  return { getAiChat, getAiChatPending };
};
