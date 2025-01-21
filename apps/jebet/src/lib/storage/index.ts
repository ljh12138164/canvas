import localforage from 'localforage';
localforage.config({
  name: 'ljh-jebet',
  version: 1.0,
  storeName: 'ljh-jebet',
});
interface ChatData {
  id: string;
  content: string;
}

interface IndexDBChanagePros {
  type: 'add' | 'delete' | 'edit';
  data?: ChatData;
  deletItem?: string;
  editData?: ChatData;
}
/**
 * 更新indexDB
 * @param type 类型
 * @param data 数据
 * @param deletItem 删除的id
 * @param editData 编辑的数据
 * @returns
 */
export function indexDBChange({ type, data, deletItem, editData }: IndexDBChanagePros) {
  if (type === 'delete' && deletItem) {
    return localforage.removeItem(deletItem);
  }
  if (type === 'add' && data) {
    return localforage.setItem(data.id, data);
  }
  if (type === 'edit' && editData) {
    localforage.removeItem(editData.id);
    return localforage.setItem(editData.id, editData);
  }
}
/**
 * 获取indexDB数据
 * @returns 数据
 */
export async function getChatData() {
  const arr: ChatData[] = [];
  await localforage.iterate((res: ChatData) => {
    arr.push(res);
  });
  return arr;
}
/**
 * 获取指定id的数据
 * @param id 数据id
 * @returns 数据
 */
export async function getChatDataById(id: string): Promise<ChatData | null> {
  return await localforage.getItem<ChatData>(id);
}

/**
 * 根据比特数转换为MB
 * @param size 比特数
 * @returns MB
 */
export function bitToMB(size: number): string {
  if (size > 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)}MB`;
  }
  if (size > 1024) {
    return `${(size / 1024).toFixed(2)}KB`;
  }
  return `${size}B`;
}

/**
 * ## 下载文件
 * @param file 文件路径
 * @param name 文件名
 */
export function downloadFile(file: string, name: string, type: string) {
  const a = document.createElement('a');
  a.href = file;
  a.download = `${name}.${type}`;
  a.click();
  a.remove();
}

/**
 * 检查文件是否是图片
 * @param type 文件类型
 * @returns 是否是图片
 */
export function checkIsImage(type: string): boolean {
  return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(type);
}
