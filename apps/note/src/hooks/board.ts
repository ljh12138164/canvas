import { client } from "@/server";
import { useQuery } from "@tanstack/vue-query";

export const useBoard = (token: string) => {
  const {
    data: folders,
    error: foldersError,
    isLoading: foldersIsLoading,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: () =>
      client.board.board.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
  return { folders, foldersError, foldersIsLoading };
};
