import { User } from "@/types/user";
import { create } from "zustand";

interface userStore {
  user: User | undefined;
  changeUser: (user: User) => void;
}
export const useuserStore = create<userStore>((set) => ({
  user: undefined,
  changeUser: (user: User) => {
    set({ user });
  },
}));
