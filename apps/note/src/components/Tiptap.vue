<script lang="ts" setup>
import Collaboration from "@tiptap/extension-collaboration";
import type { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";
// 协作
import {
  HocuspocusProvider,
  HocuspocusProviderWebsocket,
} from "@hocuspocus/provider";
import { nanoid } from "nanoid";

const doc = new Y.Doc();

const editor = useEditor({
  extensions: [
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

const websocket = new HocuspocusProviderWebsocket({
  //自己实现多 Provider 共享 ws 即可，避免多篇文档时发起多个 ws 链接
  url: "ws://localhost:8080",
});
const map = new Map();
map.set(1, {
  name: "user.name",
});
const awareness: Awareness = {
  doc,
  clientID: Math.floor(Math.random() * 1000000),
  states: new Map(),
  meta: map,
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
  <div>
    <EditorContent editor="{editor}" />
  </div>
</template>
