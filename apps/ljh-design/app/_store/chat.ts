import type { Socket } from 'socket.io-client';
import { create } from 'zustand';

interface UserState {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
}

/**
 * ### 用户信息
 */
export const useSocket = create<UserState>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}));
