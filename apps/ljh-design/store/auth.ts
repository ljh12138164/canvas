import { create } from "zustand";
const initData = {
  userId: "",
  isLoading: true,
};
export interface AuthStore {
  userId: string;
  isLoading: boolean;
  setUserId: (userId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}
export const authStore = create<AuthStore>((set) => ({
  ...initData,
  setUserId: (userId: string) => set({ userId, isLoading: false }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));