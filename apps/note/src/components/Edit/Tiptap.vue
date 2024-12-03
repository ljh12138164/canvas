<script lang="ts" setup>
import Collaboration from "@tiptap/extension-collaboration";
import type { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Image from "@tiptap/extension-image";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import ImageResize from "tiptap-extension-resize-image";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Gapcursor from "@tiptap/extension-gapcursor";
import TableRow from "@tiptap/extension-table-row";
// 协作
import {
  HocuspocusProvider,
  HocuspocusProviderWebsocket,
} from "@hocuspocus/provider";
import { nanoid } from "nanoid";
// 创建doc
const doc = new Y.Doc();
// 创建ws
const websocket = new HocuspocusProviderWebsocket({
  url: import.meta.env.PUBLIC_WS,
});
// 创建awareness
const awareness: Awareness = {
  doc,
  clientID: Math.floor(Math.random() * 1000000),
  states: new Map(),
  meta: new Map(),
  _checkInterval: 1000,
  getLocalState: () => null,
  setLocalState: () => {},
  setLocalStateField: () => {},
  getStates: () => new Map(),
  on: () => {},
  once: () => {},
  off: () => {},
  emit: () => {},
  destroy: () => {},
  _observers: new Map(),
};
// 协同
const text = new HocuspocusProvider({
  websocketProvider: websocket,
  name: "abc", // 服务端的 documentName
  document: doc,
  token: "token",
  awareness, // 这里传递 awareness 就可以实现共享用户信息
});

text.setAwarenessField("user", {
  // 设置本地用户信息，这样另外的客户端就能拿到这个信息来显示了
  name: "user.name" + Math.floor(Math.random() * 1000000),
  id: nanoid(),
});
const editor = new Editor({
  extensions: [
    StarterKit,
    // 协同
    Collaboration.configure({
      document: doc,
    }),
    // 协同光标
    CollaborationCursor.configure({
      provider: text,
      user: {
        name: `111${Math.floor(Math.random() * 1000000)}`,
        color: `#155862`,
      },
    }),
    // 表格
    Table.configure({
      resizable: true,
    }),
    TableCell,
    TableHeader,
    ImageResize,
    Gapcursor,
    TableRow,
    Image,
    // 任务列表
    TaskList,
    // 任务项
    TaskItem.configure({
      nested: true,
    }),
  ],
  content: "",
});
editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true });

// 248, 250, 254
</script>

<template>
  <EditorContent :editor="editor" />
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
.tiptap {
  :first-child {
    margin-top: 0;
  }

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

  table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    color: black;
    table-layout: fixed;
    width: 100%;

    td,
    th {
      border: 1.5px solid black;
      box-sizing: border-box;
      min-width: 1em;
      padding: 6px 8px;
      position: relative;
      vertical-align: top;
      color: black;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      background-color: #c7c7c7;
      color: black;
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      background: #959596;
      color: black;
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
      /* background-color: #959596; */
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
}
</style>
