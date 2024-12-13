import type { Session } from '@supabase/supabase-js';
import create from 'zustand-vue';

interface BearStore {
  user: Session | null;
  setUser: (val: Session) => void;
  removeUser: () => void;
}
const useBearStore = create<BearStore>((set) => ({
  user: null,
  setUser: (val: Session) => set({ user: val }),
  removeUser: () => set({ user: null }),
}));

export default useBearStore;
