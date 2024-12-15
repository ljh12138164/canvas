import { create } from 'zustand-vue'
import type { Sessions } from '../types'

interface UserState {
  user: Sessions | null
  setUser: (user: Sessions) => void
}

export const useUser = create<UserState>((set) => ({
  user: null,
  setUser: (user: Sessions) => set({ user }),
}))
