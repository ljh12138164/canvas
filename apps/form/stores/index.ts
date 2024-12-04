import create from "zustand-vue";

interface BearStore {
  bears: number;
  increasePopulation: () => void;
  setBears: (val: number) => void;
  removeAllBears: () => void;
}
const useBearStore = create<BearStore>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  setBears: (val: number) => set({ bears: val }),
  removeAllBears: () => set({ bears: 0 }),
}));

export default useBearStore;
