import { create } from "zustand";

interface userStore {
  userIdStore: string | undefined;
  changeUserId: (userId: string | undefined) => void;
}
export const useuserStore = create<userStore>((set) => ({
  userIdStore: undefined,
  changeUserId: (userId) => {
    return set({ userIdStore: userId });
  },
}));
