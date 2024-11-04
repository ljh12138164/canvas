import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../supabase/sign";
import { User } from "@/types/user";

export const useUserQuery = (userId: string) => {
  const { data, isLoading, error } = useQuery<User | undefined, Error>({
    queryKey: ["user"],
    queryFn: () => getCurrentUser({ userId }),
  });
  return { data, isLoading, error };
};
