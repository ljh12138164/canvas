import localforage from 'localforage';
localforage.config({
  name: 'ljh-dify',
  version: 1.0,
  storeName: 'ljh-dify',
});
// }
interface IndexDBChanagePros {
  type: 'add' | 'delete' | 'edit';
  data?: Partial<any>;
  deletItem?: string;
  editData?: Partial<any>;
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
    return localforage.setItem(data.id!, data);
  }
  if (type === 'edit' && editData) {
    localforage.removeItem(editData.id!);
    return localforage.setItem(editData.id!, editData);
  }
}
/**
 * 获取indexDB数据
 * @returns 数据
 */
export async function getIndexDB() {
  const arr: any[] = [];
  await localforage.iterate((res: any) => {
    arr.push(res);
  });
  return arr;
}
/**
 * 获取指定id的数据
 * @param id 数据id
 * @returns 数据
 */
export async function getTryBoardById(id: string) {
  return await localforage.getItem<any>(id);
}
