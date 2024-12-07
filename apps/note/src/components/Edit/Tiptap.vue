<script lang="ts" setup>
import Collaboration from "@tiptap/extension-collaboration";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { nanoid } from "nanoid";
import { onBeforeUnmount, onMounted, ref } from "vue";
import * as Y from "yjs";
import StarterKitComponent from "./StarterKit.vue";
// 编辑器扩展
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { Color } from "@tiptap/extension-color";
import Focus from "@tiptap/extension-focus";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import ListKeymap from "@tiptap/extension-list-keymap";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import { LineHeightExtension } from "../editExtenstions/LineHeight";

// 协作
import {
  HocuspocusProvider,
  HocuspocusProviderWebsocket,
} from "@hocuspocus/provider";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { all, createLowlight } from "lowlight";
import { FontSizeExtension } from "../editExtenstions/fontSize";
import { ScrollArea } from "../ui/scroll-area";
import Ruler from "./Ruler.vue";
import useEditor from "@/store/editor";

// 创建doc
const doc = new Y.Doc();
// 文本编辑器
const lowlight = createLowlight(all);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
// 创建ws
const websocket = new HocuspocusProviderWebsocket({
  url: import.meta.env.PUBLIC_WS,
});

// 协同
const hocuspocusConnection = new HocuspocusProvider({
  websocketProvider: websocket,
  name: "abc", // 服务端的 documentName
  document: doc,
  token: `token${Math.floor(Math.random() * 1000000)}`,
  onSynced() {
    console.log("同步");
  },
  // on
  // awareness, // 这里传递 awareness 就可以实现共享用户信息
});
hocuspocusConnection.setAwarenessField("user", {
  // 设置本地用户信息，这样另外的客户端就能拿到这个信息来显示了
  name: "user.name" + Math.floor(Math.random() * 1000000),
  id: nanoid(),
});

const editor = ref<Editor>(
  new Editor({
    extensions: [
      CodeBlockLowlight.configure({
        lowlight,
      }),
      // theme
      FontFamily,
      StarterKit.configure({
        codeBlock: false,
        history: false,
      }),
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
      }),
      // 协同
      Collaboration.configure({
        document: doc,
      }),
      // 协同光标
      CollaborationCursor.configure({
        provider: hocuspocusConnection,
        user: {
          // 用户meta信息
          name: `111${Math.floor(Math.random() * 1000000)}`,
          color: `#${Math.floor(Math.random() * 99)}0000`,
        },
      }),
      // 表格
      Table.configure({
        resizable: true,
      }),
      TableCell,
      TableHeader,
      ImageResize,
      TableRow,
      // 任务列表
      TaskList,
      // 任务项
      TaskItem.configure({
        nested: true,
      }),

      // 标记类
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: true,
        defaultProtocol: "https",
        autolink: true,
      }),
      Subscript,
      Superscript,
      TextStyle,
      Underline,
      Typography,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "写点什么吧...",
      }),
      ListKeymap,
      Focus.configure({
        className: "focus",
      }),
      Color,
      // 自定义命令
      FontSizeExtension,
      LineHeightExtension,
      // Commands.configure({
      //   suggestion,
      // }),
    ],
    content: `
        <h3>
          Have you seen our tables? They are amazing!
        </h3>
        <ul>
          <li>Tables with rows, cells and headers (optional)</li>
          <li>Support for <code>colgroup</code> and <code>rowspan</code></li>
          <li>And even resizable columns (optional)</li>
        </ul>
        <p>
          Here is an example:
        </p>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
            <tr>
              <td>Marie Curie</td>
              <td>Scientist</td>
              <td>Chemist</td>
              <td>Physicist</td>
            </tr>
            <tr>
              <td>Indira Gandhi</td>
              <td>Prime minister</td>
              <td colspan="2">Politician</td>
            </tr>
          </tbody>
        </table>
      `,
  })
);
onMounted(() => {
  useEditor().setEditorData(editor.value as Editor);
});
onBeforeUnmount(() => {
  editor.value.destroy();
});
// 测试图标
</script>

<template>
  <main class="flex flex-col">
    <ScrollArea class="overflow-x-auto">
      <StarterKitComponent :editor="editor as Editor" />
      <Ruler />
    </ScrollArea>
    <EditorContent :editor="editor as Editor" />
  </main>
  <!--
  <BubbleMenu
    :editor="editor as Editor"
    :tippy-options="{ duration: 100 }"
    class="bubble-menu"
    v-if="editor && !useEditorStore().loadEditor"
  >
    <StarterKitComponent />
  </BubbleMenu>
  -->
</template>

<style lang="scss">
.tiptap {
  min-height: calc(100dvh - 150px) !important;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* aspect-ratio: 9/16; */
  background-color: white;
  margin: 10px 0;
  border: 1.5px solid #c7c7c7;
  &:focus-visible {
    outline: none;
  }
}
.bubble-menu {
  width: 80dvw;
}
.tiptap {
  //:first-child {
  //  margin-top: 0;
  //}

  // 标题
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.6rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  // 无序列表
  ul li {
    list-style-type: disc;

    p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }
  // 有序列表
  ol li {
    list-style-type: decimal;
    p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }
  // 任务列表
  ul[data-type="taskList"] {
    list-style: none;
    margin-left: 0;
    padding: 0;

    li {
      align-items: flex-start;
      display: flex;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }

    input[type="checkbox"] {
      cursor: pointer;
    }

    ul[data-type="taskList"] {
      margin: 0;
    }
  }

  /* Table-specific styling */
  table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;

    td,
    th {
      border: 1px solid var(--gray-3);
      box-sizing: border-box;
      min-width: 1em;
      padding: 6px 8px;
      position: relative;
      vertical-align: top;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      background-color: var(--gray-1);
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      background: var(--gray-2);
      content: "";
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      position: absolute;
      z-index: 2;
    }

    .column-resize-handle {
      background-color: var(--purple);
      bottom: -2px;
      pointer-events: none;
      position: absolute;
      right: -2px;
      top: 0;
      width: 4px;
    }
  }

  .tableWrapper {
    margin: 1.5rem 0;
    overflow-x: auto;
    transition: all 0.3s ease;

    &::-webkit-scrollbar {
      width: 12px;
      height: 12px;
      &:hover {
        cursor: pointer;
      }
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 10px;
      border: 3px solid #f1f1f1;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }

  &.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
  // 图片
  img {
    display: block;
    height: auto;
    margin: 1.5rem 0;
    max-width: 100%;

    &.ProseMirror-selectednode {
      outline: 3px solid var(--purple);
    }
  }
  // 引用
  blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }
  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    cursor: pointer;
    margin: 2rem 0;

    &.ProseMirror-selectednode {
      border-top: 1px solid var(--purple);
    }
  }

  // 代码块
  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: "JetBrainsMono", monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  // 代码高亮
  .hljs-comment,
  .hljs-quote {
    color: #616161;
  }
  .hljs-variable,
  .hljs-template-variable,
  .hljs-attribute,
  .hljs-tag,
  .hljs-name,
  .hljs-regexp,
  .hljs-link,
  .hljs-name,
  .hljs-selector-id,
  .hljs-selector-class {
    color: #f98181;
  }
  .hljs-number,
  .hljs-meta,
  .hljs-built_in,
  .hljs-builtin-name,
  .hljs-literal,
  .hljs-type,
  .hljs-params {
    color: #fbbc88;
  }
  .hljs-string,
  .hljs-symbol,
  .hljs-bullet {
    color: #b9f18d;
  }
  .hljs-title,
  .hljs-section {
    color: #faf594;
  }
  .hljs-keyword,
  .hljs-selector-tag {
    color: #70cff8;
  }
  .hljs-emphasis {
    font-style: italic;
  }
  .hljs-strong {
    font-weight: 700;
  }

  mark {
    background-color: #faf594;
    border-radius: 0.4rem;
    box-decoration-break: clone;
    padding: 0.1rem 0.3rem;
  }

  code {
    background-color: rgba(88, 5, 255, 0.05);
    border-radius: 0.4rem;
    color: #000;
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  a {
    color: #1b15ca;
    cursor: pointer;

    &:hover {
      color: #1b15ca;
      border-bottom: 1px solid #1b15ca;
    }
  }

  // 菜单
  button {
    background-color: unset;

    &:hover {
      background-color: var(--gray-3);
    }

    &.is-active {
      background-color: var(--purple);

      &:hover {
        background-color: var(--purple-contrast);
      }
    }
  }

  .has-focus {
    border-radius: 3px;
    box-shadow: 0 0 0 2px var(--purple);
  }

  /* Placeholder (at the top) */
  p.is-editor-empty:first-child::before {
    color: var(--gray-4);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  p {
    word-break: break-all;
  }

  /* Give a remote user a caret */
  .collaboration-cursor__caret {
    border-left: 1px solid #0d0d0d;
    border-right: 1px solid #0d0d0d;
    margin-left: -1px;
    margin-right: -1px;
    pointer-events: none;
    position: relative;
    word-break: normal;
  }

  /* Render the username above the caret */
  .collaboration-cursor__label {
    border-radius: 3px 3px 3px 0;
    color: #0d0d0d;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    left: -1px;
    line-height: normal;
    padding: 0.1rem 0.3rem;
    position: absolute;
    top: -1.4em;
    user-select: none;
    white-space: nowrap;
  }
}
</style>
