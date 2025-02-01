import { to } from 'await-to-js';
import { Hono } from 'hono';
import { getDocs, saveDocument } from '../../../server/note/webhook';
//工作原理
// webhook 扩展最多可监听四个可配置的事件/钩子，这些事件/钩子将触发对配置的 url 的 POST 请求。
export const webhook = new Hono()
  .post('/save', async (c) => {
    const json = await c.req.json();

    if (json.event === 'change') {
      const documentName = json.payload.documentName.split('/');
      const document = JSON.stringify(json.payload.document);
      const workspaceId = documentName[1];
      const folderId = documentName[2];
      const fileId = documentName[3];
      const [err] = await to(
        saveDocument({
          document,
          workspaceId,
          folderId,
          fileId,
        }),
      );
      if (err) return c.json({ message: '服务器错误' });
      return c.json({
        message: 'suceess',
      });
    }
    const documentName = json.payload.documentName.split('/');
    const workspaceId = documentName[1];
    const folderId = documentName[2];
    const fileId = documentName[3];
    const [, document] = await to(
      getDocs({
        workspaceId,
        id: fileId ? fileId : folderId,
        type: fileId ? 'file' : 'folder',
      }),
    );
    // console.log(document);
    return c.text(document!);
  })
  .get('/', (c) => {
    return c.json({
      message: 'suceess',
    });
  });
