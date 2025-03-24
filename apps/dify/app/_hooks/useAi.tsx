import { useMutation } from '@tanstack/react-query';
import type { InferRequestType } from 'hono';
import { clientAi } from '../_datebase';

type FabricRequestType = InferRequestType<typeof clientAi.grap.mermaid.$post>;
/**
 * ### 使用AI生成Fabric.js对象配置（流式响应）
 */
export const useAiFabricStream = () => {
  const { mutate: getAiFabricStream, isPending: getAiFabricStreamPending } = useMutation<
    ReadableStream<Buffer>,
    Error,
    FabricRequestType
  >({
    // @ts-ignore
    mutationFn: async (datas) => {
      const response = await clientAi.grap.mermaid.$post(datas);
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.body;
    },
  });

  return { getAiFabricStream, getAiFabricStreamPending };
};

type AiImageRequestType = InferRequestType<typeof clientAi.image.generateImage.$post>;
/**
 * ### 使用AI生成图片
 */
export const useAiImage = () => {
  const { mutate: getAiImage, isPending: getAiImagePending } = useMutation<
    { success: boolean; images: Array<{ mimeType: string; data: string }>; message?: string },
    Error,
    AiImageRequestType
  >({
    mutationFn: async (datas) => {
      const response = await clientAi.image.generateImage.$post(datas);
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });

  return { getAiImage, getAiImagePending };
};
