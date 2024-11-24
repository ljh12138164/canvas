<script lang="ts" setup>
import Collaboration from "@tiptap/extension-collaboration";
import type { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
// 协作
import {
  HocuspocusProvider,
  HocuspocusProviderWebsocket,
} from "@hocuspocus/provider";
import { nanoid } from "nanoid";

const doc = new Y.Doc();
const editor = new Editor({
  extensions: [
    StarterKit,
    Collaboration.configure({
      document: doc,
    }),
  ],
  content: `
      <p>
        This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
      </p>
      <p>
        The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
      </p>
    `,
});

// 创建ws
const websocket = new HocuspocusProviderWebsocket({
  url: import.meta.env.PUBLIC_WS,
});

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
  name: "user.name",
  id: nanoid(),
});
</script>

<template>
  <EditorContent :editor="editor" />
</template>
