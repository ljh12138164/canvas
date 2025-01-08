import { Server } from '@hocuspocus/server';
// import express from 'express';
// import expressWebsockets from 'express-ws';
import { verify } from 'hono/jwt';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { Webhook, Events } from '@hocuspocus/extension-webhook';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Color } from '@tiptap/extension-color';
import Focus from '@tiptap/extension-focus';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import ListKeymap from '@tiptap/extension-list-keymap';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
// import { all, createLowlight } from 'lowlight';
// import css from 'highlight.js/lib/languages/css';
// import js from 'highlight.js/lib/languages/javascript';
// import ts from 'highlight.js/lib/languages/typescript';
// import html from 'highlight.js/lib/languages/xml';
import { LineHeightExtension } from './extension/LineHeight';
import { FontSizeExtension } from './extension/fontSize';
import * as Y from 'yjs';
interface Payload {
  // 签发者
  iss: string;
  // 用户唯一标识
  sub: string;
  // 受众
  aud: string;
  // 过期时间
  exp: number;
  // 签发时间
  iat: number;
  // 用户信息
  user_metadata: {
    sub: string;
    [key: string]: any;
  };
  // 角色
  role: string;
  // 认证方法
  amr: [{ method: string; timestamp: number }];
  // 会话ID
  session_id: string;
  // 是否匿名
  is_anonymous: boolean;
  // 认证级别
  aal: string;
  // 邮箱
  email: string;
  // 电话
  phone: string;
  // 电话验证
}
// const lowlight = createLowlight(all);
// lowlight.register('html', html);
// lowlight.register('css', css);
// lowlight.register('js', js);
// lowlight.register('ts', ts);
// Setup your express instance using the express-ws extension
// const { app } = expressWebsockets(express());
const server = Server.configure({
  extensions: [
    new Webhook({
      url: 'http://localhost:8000/api/note/webhook/save',
      secret: '459824aaffa928e05f5b1caec411ae5f',
      events: [Events.onChange, Events.onDisconnect],
      debounce: 2000,
      transformer: TiptapTransformer.extensions([
        // CodeBlockLowlight.configure({
        //   lowlight,
        // }),
        FontFamily,
        StarterKit.configure({
          codeBlock: false,
          history: false,
        }),
        // 表格
        Table.configure({
          resizable: true,
        }),
        TableCell,
        TableHeader,
        TableRow,
        // 任务列表
        TaskList,
        // 任务项
        TaskItem.configure({
          nested: true,
        }),
        FontSizeExtension,
        // 标记类
        Highlight.configure({ multicolor: true }),
        Link.configure({
          openOnClick: true,
          defaultProtocol: 'https',
          autolink: true,
        }),
        LineHeightExtension,
        Subscript,
        Superscript,
        TextStyle,
        Underline,
        Typography,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
          placeholder: '写点什么吧...',
        }),
        ListKeymap,
        Focus.configure({
          className: 'focus',
        }),
        Color,
      ]),
      debounceMaxWait: 10000,
    }),
  ],
  // port: 8080,
  yDocOptions: { gc: false, gcFilter: () => false },
  /**
   * 认证 hook
   * @param payload
   * @returns
   */
  // async onAuthenticate(payload) {
  //   const { token } = payload;
  //   try {
  //     const secret = 'ud6wq6x4l11dXi+qq4V49phNnbQ3dc5784hlB84460QW6au81sHtYluY0VPqXwIvLM2rrwJDVwKABLVhrOfHhQ==';
  //     const { payload: jwtPayload } = await verify(token, secret);
  //     // 如果token过期，则返回false
  //     if (!jwtPayload) return false;
  //     const userPaload = jwtPayload as any as Payload;
  //     return { user: userPaload };
  //   } catch (error) {
  //     console.error('Token verification failed:', error);
  //     return false;
  //   }
  // },
  /**
   * 加载文档 hook
   * @param payload
   * @returns
   */
  onLoadDocument: async (payload) => {
    const { documentName } = payload;
    // console.log(documentName);
  },
  /**
   * 保存文档 hook
   * @param payload
   */
  onStoreDocument: async (payload) => {
    const { documentName, document } = payload;
    const update = Y.encodeStateAsUpdate(document);
  },
});
// const httpServer = createServer(express());
// app.get("/", (request, response) => {
//   response.send("Hello World!");
// });
// 协同服务器
// app.ws('/note/collaboration', (websocket, request) => {
//   const context = {
//     user: {
//       id: 1234,
//       name: 'Jane',
//     },
//   };

//   server.handleConnection(websocket, request, context);
// });
server.listen(8080);
// // 房间
// const clients: Map<string, Set<any>> = new Map();
// // 画布服务器
// app.ws("/design/:id", (websocket, request) => {
//   websocket.on("connection", (websockets) => {
//     console.log("连接");
//     setupWSConnection(websockets, websocket);
//   });
//   // setupWSConnection(websocket, request);
//   // // console.log(request.socket);
//   // // 处理错误的id
//   // clients.set(
//   //   request.params.id,
//   //   clients.get(request.params.id)
//   //     ? clients.get(request.params.id)?.add(websocket)!
//   //     : new Set([websocket])
//   // );
//   // websocket.on("message", (message) => {
//   //   const client = clients.get(request.params.id);
//   //   // 当接收到消息时，广播给所有 画布客户端
//   //   if (client?.size) {
//   //     client?.forEach((client) => {
//   //       // console.log("message", message.toString());
//   //       client.send(message);
//   //     });
//   //   }
//   // });
//   // websocket.on("close", () => {
//   //   // 当连接关闭时，从集合中移除
//   //   clients.get(request.params.id)?.delete(websocket);
//   // });
// });

// app.listen(8080);
/**
 * 创建空文档
 * @returns
 */
// const createEmptyDocument = async () => {
//   const doc = new Y.Doc();
//   const blocks = doc.getMap("blocks");

//   const block = (
//     flavour: string,
//     version: number,
//     props: Record<string, any> = {},
//     children: string[] = []
//   ): [string, Y.Map<unknown>] => {
//     const id = nanoid();
//     const block = new Y.Map();
//     block.set("sys:id", id);
//     block.set("sys:flavour", flavour);
//     block.set("sys:version", version);
//     block.set("sys:children", Y.Array.from(children));

//     Object.entries(props).forEach(([key, value]) => {
//       block.set("prop:" + key, value);
//     });

//     blocks.set(id, block);

//     return [id, block];
//   };

//   const [paragraph] = block("affine:paragraph", 1, {
//     text: new Y.Text("Hello World!"),
//     type: "text",
//   });

//   const [note] = block(
//     "affine:note",
//     1,
//     {
//       xywh: "[0,0,800,95]",
//       background: "--affine-note-background-blue",
//       index: "a0",
//       hidden: false,
//       displayMode: "both",
//       edgeless: {
//         style: {
//           borderRadius: 0,
//           borderSize: 4,
//           borderStyle: "none",
//           shadowType: "--affine-note-shadow-sticker",
//         },
//       },
//     },
//     [paragraph]
//   );

//   const [surface] = block("affine:surface", 5);
//   const [page] = block("affine:page", 2, { title: new Y.Text("Test") }, [
//     surface,
//     note,
//   ]);

//   return doc;
// };
