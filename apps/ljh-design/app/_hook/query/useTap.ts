import { useQuery } from "@tanstack/react-query";
import { client } from "@/app/_database";

/***
 * ### 获取用户标签
 * @returns
 */
export const useGetTap = (token: string, userId: string) => {
  const {
    data: tapData,
    isLoading: tapLoading,
    error: tapError,
  } = useQuery({
    queryKey: ["tap", userId],
    queryFn: async () => {
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
