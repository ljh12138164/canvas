import { clientAi } from "@/app/_database";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType } from "hono";
type UpdateRequestType = InferRequestType<typeof clientAi.chat.stream.$post>;
/**
 * ## 使用AI 聊天
 */
export const useAi = () => {
  const { mutate: getAiStream, isPending: getAiStreamPending } = useMutation<
    ReadableStream<string>,
    Error,
    UpdateRequestType
  >({
    mutationFn: async (datas) => {
      const response = await clientAi.chat.stream.$post(datas);
      if (!response.ok) {
        throw new Error("请求错误");
      }
      return response.body as ReadableStream<string>;
    },
  });
  return { getAiStream, getAiStreamPending };
};
