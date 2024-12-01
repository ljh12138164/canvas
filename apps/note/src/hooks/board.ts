import { client } from "@/server";
import { useQuery } from "@tanstack/vue-query";

export const useBoard = (token: string) => {
  const { data, error } = useQuery({
    queryKey: ["board"],
    queryFn: () =>
      client.board.board.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
  return { data, error };
};
