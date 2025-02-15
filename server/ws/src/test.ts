import { Events, Webhook } from '@hocuspocus/extension-webhook';
import { type Extension, Server } from '@hocuspocus/server';
import { TiptapTransformer } from '@hocuspocus/transformer';
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
// @deno-types="npm:@types/express@4.17.15"
import express from 'express';
import expressWebsockets from 'express-ws';
import { LineHeightExtension } from './extension/LineHeight.ts';
import { FontSizeExtension } from './extension/fontSize.ts';
const server = Server.configure({
  extensions: [
    new Webhook({
      url: 'https://ljhboard.cn/api/note/webhook/save',
      secret: process.env.WEBHOOK_SECRET,
      events: [Events.onChange, Events.onCreate],
      debounce: 5000,
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
    }) as unknown as Extension,
  ],
  yDocOptions: { gc: false, gcFilter: () => false },
  /**
   * 认证 hook
   * @param payload
   * @returns
   */
  // async onAuthenticate(payload) {
  //   const { token } = payload;
  //   try {
  //     const secret =
  //       'ud6wq6x4l11dXi+qq4V49phNnbQ3dc5784hlB84460QW6au81sHtYluY0VPqXwIvLM2rrwJDVwKABLVhrOfHhQ==';
  //     const tokens = token.split(' ');
  //     const jwt = tokens.at(-1);
  //     if (!jwt) return false;
  //     const { payload: jwtPayload } = await verify(jwt, secret);
  //     // 如果token过期，则返回false
  //     if (!jwtPayload) throw new Error('Token verification failed');
  //     const userPaload = jwtPayload as any as Payload;
  //     return { user: userPaload };
  //   } catch (error) {
  //     console.error('Token verification failed:', error);
  //     // return false;
  //   }
  // },
});
const { app } = expressWebsockets(express());
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.ws('/collaboration', (websocket, request) => {
  const context = {
    user: {
      id: 1234,
      name: 'Jane',
    },
  };

  server.handleConnection(websocket, request, context);
});
// console.log('server start');
app.listen(8080);
