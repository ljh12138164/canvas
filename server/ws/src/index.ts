import { Events, Webhook } from '@hocuspocus/extension-webhook';
import { Server } from '@hocuspocus/server';
// import { verify } from "hono/jwt";
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
import { LineHeightExtension } from './extension/LineHeight';
import { FontSizeExtension } from './extension/fontSize';
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

server.listen(8080);
