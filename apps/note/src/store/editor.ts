import type { HocuspocusProvider } from '@hocuspocus/provider';
import type { Editor } from '@tiptap/vue-3';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const useEditor = defineStore('editor', () => {
  // 初始化
  const loadEditor = ref<boolean>(true);
  const setLoadEditor = (data: boolean) => {
    loadEditor.value = data;
  };
  // 为了完整类型推理，推荐使用箭头函数
  const editorData = ref<Editor | null>(null);
  const editorDatas = computed(() => editorData.value);
  const setEditorData = (data: Editor | null) => {
    editorData.value = data;
  };
  // 协同
  const hocuspocusConnection = ref<HocuspocusProvider | null>(null);
  const setHocuspocusConnection = (data: HocuspocusProvider | null) => {
    hocuspocusConnection.value = data;
  };
  // 编辑器方法
  const tiptapKit = ref([
    {
      label: '撤销',
      icon: 'mdi:undo',
      onClick: (editor: Editor) => editor?.chain().focus().undo().run(),
      disabled: (editor: Editor) => !editor?.can().undo(),
    },
    {
      label: '重做',
      icon: 'mdi:redo',
      onClick: (editor: Editor) => editor?.chain().focus().redo().run(),
      disabled: (editor: Editor) => !editor?.can().redo(),
    },
    {
      label: '加粗',
      icon: 'tabler:bold',
      isActive: (editor: Editor) => !!editor?.isActive('bold'),
      onClick: (editor: Editor) => editor?.chain().focus().toggleBold().run(),
    },
    {
      label: '斜体',
      icon: 'tabler:italic',
      isActive: (editor: Editor) => !!editor?.isActive('italic'),
      onClick: (editor: Editor) => editor?.chain().focus().toggleItalic().run(),
    },
    {
      label: '下划线',
      icon: 'tabler:underline',
      isActive: (editor: Editor) => !!editor?.isActive('underline'),
      onClick: (editor: Editor) => editor?.chain().focus().toggleUnderline().run(),
    },
    //
    {
      label: '列表',
      icon: 'mdi:format-list-bulleted',
      isActive: (editor: Editor) => !!editor?.isActive('bulletList'),
      onClick: (editor: Editor) => editor?.chain().focus().toggleBulletList().run(),
    },
    //
    {
      label: '代办',
      icon: 'tabler:checkbox',
      isActive: (editor: Editor) => !!editor?.isActive('taskList'),
      onClick: (editor: Editor) => editor?.chain().focus().toggleTaskList().run(),
    },
    {
      label: '代码块',
      icon: 'tabler:code',
      isActive: (editor: Editor) => !!editor?.isActive('codeBlock'),
      onClick: (editor: Editor) => editor?.chain().focus().toggleCodeBlock().run(),
    },
    {
      label: '移除标记',
      icon: 'tabler:trash',
      onClick: (editor: Editor) => editor?.chain().focus().unsetAllMarks().run(),
      disabled: (editor: Editor) => !editor?.can().unsetAllMarks(),
    },
  ]);

  return {
    loadEditor,
    setLoadEditor,
    // 编辑器
    editorData,
    editorDatas,
    setEditorData,
    // 协同
    hocuspocusConnection,
    setHocuspocusConnection,
    // 编辑器工具栏
    tiptapKit,
  };
});

export default useEditor;
