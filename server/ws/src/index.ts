import { Server } from '@hocuspocus/server';
import * as Y from 'yjs';
import { Webhook, Events } from '@hocuspocus/extension-webhook';
const server = Server.configure({
  extensions: [
    new Webhook({
      url: 'http://localhost:8000/api/note/webhook',
      secret: '459824aaffa928e05f5b1caec411ae5f',
      events: [
        Events.onChange,
        Events.onCreate,
        Events.onConnect,
        Events.onConnect,
      ],
      debounce: 2000,
      debounceMaxWait: 10000,
    }),
  ],
  port: 8080,
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
  },
  /**
   * 保存文档 hook
   * @param payload
   */
  onStoreDocument: async (payload) => {
    const { documentName, document } = payload;

    const update = Y.encodeStateAsUpdate(document);
    console.log(update);
  },
});
server.listen();
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
