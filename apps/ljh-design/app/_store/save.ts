import { create } from 'zustand';

interface SaveState {
  cloudSave: boolean;
  setCloudSave: (save: boolean) => void;
}

/**
 * ### 检查是否保存
 */
export const useSave = create<SaveState>((set) => ({
  cloudSave: false,
  setCloudSave: (cloudSave) => set({ cloudSave }),
}));
