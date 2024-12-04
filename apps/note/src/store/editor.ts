import { HocuspocusProvider } from "@hocuspocus/provider";
import { Editor } from "@tiptap/vue-3";
import { defineStore } from "pinia";
import { ref } from "vue";

const useEditor = defineStore("editor", () => {
  // 初始化
  const loadEditor = ref<boolean>(true);
  const setLoadEditor = (data: boolean) => (loadEditor.value = data);
  // 为了完整类型推理，推荐使用箭头函数
  const editorData = ref<Editor | null>(null);
  const setEditorData = (data: Editor) => (editorData.value = data);
  // 协同
  const hocuspocusConnection = ref<HocuspocusProvider | null>(null);
  const setHocuspocusConnection = (data: HocuspocusProvider) =>
    (hocuspocusConnection.value = data);
  // 编辑器方法
  return {
    loadEditor,
    setLoadEditor,
    // 编辑器
    editorData,
    setEditorData,
    // 协同
    hocuspocusConnection,
    setHocuspocusConnection,
  };
});

export default useEditor;
