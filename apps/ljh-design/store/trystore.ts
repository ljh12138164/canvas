import { Board } from "@/types/board";
import { create } from "zustand";

interface InitData {
  data: Board | undefined;
  isLoading: boolean;
  setData: (data: Board) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const tryStore = create<InitData>((set) => ({
  data: undefined,
  isLoading: true,
  setData: (data) => set({ data }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
