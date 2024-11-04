import { Edit } from "@/types/Edit";
import { create } from "zustand";
interface EditorStore {
  editor: Edit | undefined;
  changeEditor: (editor: Edit) => void;
}
export const useEditorStore = create<EditorStore>((set) => ({
  editor: undefined,
  changeEditor: (editor: Edit) => {
    set({ editor });
  },
}));
