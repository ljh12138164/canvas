import type { Sessions } from "@/types/index";
interface Users {
  userData: Sessions | null;
  initLoading: boolean;
}

export const useUser = () =>
  useState<Users>("user", () => ({
    userData: null,
    initLoading: false,
  }));

export const useUserStore = () => useUser();
