import type { Sessions } from '@/app/_types/user';
import { create } from 'zustand';

interface UserState {
  loading: boolean;
  user: Sessions | null;
  setUser: (user: Sessions) => void;
  setLoading: (loading: boolean) => void;
}

export const useUser = create<UserState>((set) => ({
  loading: true,
  user: null,
  setUser: (user: Sessions) => set({ user, loading: false }),
  setLoading: (loading: boolean) => set({ loading }),
}));
