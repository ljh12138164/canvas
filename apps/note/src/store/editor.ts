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
  const setEditorData = (data: Editor | null) => (editorData.value = data);
  // 协同
  const hocuspocusConnection = ref<HocuspocusProvider | null>(null);
  const setHocuspocusConnection = (data: HocuspocusProvider | null) =>
    (hocuspocusConnection.value = data);
  // 编辑器方法
  const tiptapKit = ref([
    {
      label: "撤销",
      icon: "mdi:undo",
      onClick: () => editorData.value?.chain().focus().undo().run(),
    },
    {
      label: "重做",
      icon: "mdi:redo",
      onClick: () => editorData.value?.chain().focus().redo().run(),
    },
    {
      label: "打印",
      icon: "mdi:printer",
      onClick: () => window.print(),
    },
    {
      label: "拼写检查",
      icon: "mdi:spellcheck",
      onClick: () => {
        const current = editorData.value?.view.dom.getAttribute("spellcheck");
        console.log(current);
        editorData.value?.view.dom.setAttribute(
          "spellcheck",
          current === "false" ? "true" : "false"
        );
      },
    },
    // 标记
    {
      label: "加粗",
      icon: "tabler:bold",
      isActive: !!editorData.value?.isActive("bold"),
      onClick: () => editorData.value?.chain().focus().toggleBold().run(),
    },
    {
      label: "斜体",
      icon: "tabler:italic",
      isActive: !!editorData.value?.isActive("italic"),
      onClick: () => editorData.value?.chain().focus().toggleItalic().run(),
    },
    {
      label: "下划线",
      icon: "tabler:underline",
      isActive: !!editorData.value?.isActive("underline"),
      onClick: () => editorData.value?.chain().focus().toggleUnderline().run(),
    },
    //
    {
      label: "列表",
      icon: "mdi:format-list-bulleted",
      isActive: false,
      onClick: () => {
        //TODO: 切换列表类型
        // editorData.value?.chain().focus().toggleBulletList().run();
      },
    },
    //
    {
      label: "代办",
      icon: "tabler:checkbox",
      isActive: !!editorData.value?.isActive("taskList"),
      onClick: () => {
        editorData.value?.chain().focus().toggleTaskList().run();
      },
    },
    {
      label: "代码块",
      icon: "tabler:code",
      isActive: !!editorData.value?.isActive("codeBlock"),
      onClick: () => editorData.value?.chain().focus().toggleCodeBlock().run(),
    },
    {
      label: "移除标记",
      icon: "tabler:trash",
      onClick: () => editorData.value?.chain().focus().unsetAllMarks().run(),
    },
  ]);

  // const fontH
  // 字体
  const fontFamily = ref(
    editorData.value?.getAttributes("textStyle")?.fontFamily || ""
  );
  const fontTitle = ref(
    editorData.value?.isActive("heading")
      ? editorData.value?.getAttributes("heading")?.level || 0
      : ""
  );

  const setTiptapKit = (data: Editor) => {
    tiptapKit.value = [
      {
        label: "撤销",
        icon: "mdi:undo",
        onClick: () => data?.chain().focus().undo().run(),
      },
      {
        label: "重做",
        icon: "mdi:redo",
        onClick: () => data?.chain().focus().redo().run(),
      },
      {
        label: "打印",
        icon: "mdi:printer",
        onClick: () => window.print(),
      },
      {
        label: "拼写检查",
        icon: "mdi:spellcheck",
        onClick: () => {
          const current = data?.view.dom.getAttribute("spellcheck");
          console.log(current);
          data?.view.dom.setAttribute(
            "spellcheck",
            current === "false" ? "true" : "false"
          );
        },
      },
      // 标记
      {
        label: "加粗",
        icon: "tabler:bold",
        isActive: !!data?.isActive("bold"),
        onClick: () => data?.chain().focus().toggleBold().run(),
      },
      {
        label: "斜体",
        icon: "tabler:italic",
        isActive: !!data?.isActive("italic"),
        onClick: () => data?.chain().focus().toggleItalic().run(),
      },
      {
        label: "下划线",
        icon: "tabler:underline",
        isActive: !!data?.isActive("underline"),
        onClick: () => data?.chain().focus().toggleUnderline().run(),
      },
      //
      {
        label: "列表",
        icon: "mdi:format-list-bulleted",
        isActive: false,
        onClick: () => {
          //TODO: 切换列表类型
          // data?.chain().focus().toggleBulletList().run();
        },
      },
      //
      {
        label: "代办",
        icon: "tabler:checkbox",
        isActive: !!data?.isActive("taskList"),
        onClick: () => data?.chain().focus().toggleTaskList().run(),
      },
      {
        label: "代码块",
        icon: "tabler:code",
        isActive: !!data?.isActive("codeBlock"),
        onClick: () => data?.chain().focus().toggleCodeBlock().run(),
      },
      {
        label: "移除标记",
        icon: "tabler:trash",
        onClick: () => data?.chain().focus().unsetAllMarks().run(),
      },
    ];
    fontFamily.value = data?.getAttributes("textStyle")?.fontFamily || "";
    fontTitle.value = data?.isActive("heading")
      ? data?.getAttributes("heading")?.level || 0
      : "";
  };

  return {
    loadEditor,
    setLoadEditor,
    // 编辑器
    editorData,
    setEditorData,
    // 协同
    hocuspocusConnection,
    setHocuspocusConnection,
    // 编辑器工具栏
    tiptapKit,
    setTiptapKit,
    fontFamily,
    fontTitle,
  };
});

export default useEditor;
