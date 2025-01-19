import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/app/_database";
import { getNewToken } from "@/app/_lib/sign";
import { InferRequestType, InferResponseType } from "hono";

/***
 * ### 获取用户标签
 * @returns
 */
export const useGetTap = (userId: string) => {
  const {
    data: tapData,
    isLoading: tapLoading,
    error: tapError,
  } = useQuery({
    queryKey: ["tap", userId],
    queryFn: async () => {
      const token = await getNewToken();
      const response = await client.tap.userTap.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("请求错误");
      }
      return response.json();
    },
  });
  return { tapData, tapLoading, tapError };
};

type CreateResponseType = InferResponseType<
  (typeof client.tap)["create"]["$post"]
>;
type CreateRequestType = InferRequestType<
  (typeof client.tap)["create"]["$post"]
>;
/**
 * ### 创建标签
 * @param tag 标签
 * @param userId 用户id
 * @returns
 */
export const useCreateTap = () => {
  const { mutate: createTap, isPending: createTapPending } = useMutation<
    CreateResponseType,
    Error,
    CreateRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      const response = await client.tap.create.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    },
  });
  return { createTap, createTapPending };
};
