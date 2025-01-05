import { Server } from "@hocuspocus/server";
import express from "express";
import expressWebsockets from "express-ws";
// @ts-ignore
import * as Y from "yjs";

// Setup your express instance using the express-ws extension
const { app } = expressWebsockets(express());
const server = Server.configure({
  extensions: [
    // new Webhook({
    //   url: "http://localhost:8000/api/note/webhook",
    //   secret: "459824aaffa928e05f5b1caec411ae5f",
    //   events: [
    //     Events.onChange,
    //     Events.onCreate,
    //     Events.onConnect,
    //     Events.onDisconnect,
    //   ],
    //   debounce: 2000,
    //   debounceMaxWait: 10000,
    // }),
  ],
  // port: 8080,
  yDocOptions: { gc: false, gcFilter: () => false },
  /**
   * 认证 hook
   * @param payload
   * @returns
   */
  // TODO: 协作认证
  onAuthenticate: async (payload) => {
    // console.log(payload);
  },
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
app.ws("/note/collaboration", (websocket, request) => {
  const context = {
    user: {
      id: 1234,
      name: "Jane",
    },
  };

  server.handleConnection(websocket, request, context);
});

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

app.listen(8080);
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
