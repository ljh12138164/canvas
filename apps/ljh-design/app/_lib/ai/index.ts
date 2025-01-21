import type { Message, MessageArr } from '@/app/_types/ai';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
localforage.config({
  name: 'ljh-design-ai',
  version: 1.0,
  storeName: 'ljh-design-ai',
});

interface IndexDBChanagePros {
  type: 'add' | 'delete';
  data?: MessageArr;
  deletItem?: string;
  id: string;
}
/**
 * 更新indexDB
 * @param type 类型
 * @param data 数据
 * @param deletItem 删除的id
 * @param id 新增的id
 * @param editData 编辑的数据
 * @returns
 */
export async function indexDBChange({ type, data, deletItem, id }: IndexDBChanagePros): Promise<boolean> {
  if (type === 'delete' && deletItem) {
    await localforage.removeItem(deletItem);
    return true;
  }
  // 添加和编辑
  if (type === 'add' && data) {
    await localforage.setItem(id, data);
    return true;
  }

  return false;
}
/**
 * ### 获取ai上下文数据
 * @returns 数据
 */
export async function getIndexDB(): Promise<MessageArr[]> {
  const arr: MessageArr[] = [];
  // 遍历localforage获取全部上下文
  await localforage.iterate((res: MessageArr) => {
    arr.push(res);
  });
  return arr;
}
/**
 * 获取指定id的数据
 * @param id 数据id
 * @returns 数据
 */
export async function getAiChatById(id: string): Promise<MessageArr | null> {
  const res = await localforage.getItem<MessageArr>(id);
  return res || null;
}

/**
 * ### 创建新对话
 * @param id 对话id
 * @param newMessage 新消息
 * @param name 对话名称
 * @returns
 */
export async function createAi(id: string, newMessage: Message[], name: string): Promise<boolean> {
  indexDBChange({
    type: 'add',
    // 每个对话一个id，用于删除
    data: { id: nanoid(), history: newMessage, name },
    id,
  });
  return true;
}
