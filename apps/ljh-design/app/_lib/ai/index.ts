import { Ai } from "@/app/_types/ai";
import localforage from "localforage";
localforage.config({
  name: "ljh-design-ai",
  version: 1.0,
  storeName: "ljh-design-ai",
});

interface IndexDBChanagePros {
  type: "add" | "delete";
  data?: Ai;
  deletItem?: string;
}
/**
 * 更新indexDB
 * @param type 类型
 * @param data 数据
 * @param deletItem 删除的id
 * @param editData 编辑的数据
 * @returns
 */
export async function indexDBChange({
  type,
  data,
  deletItem,
}: IndexDBChanagePros): Promise<boolean> {
  if (type === "delete" && deletItem) {
    await localforage.removeItem(deletItem);
    return true;
  }
  if (type === "add" && data) {
    const arr = await localforage.getItem<Ai[]>("ai");
    // 如果存在，则添加到数组中
    if (arr) {
      arr.push(data);
      await localforage.setItem("ai", arr);
      return true;
    } else {
      // 如果不存在，则创建数组并添加数据
      await localforage.setItem("ai", [data]);
      return true;
    }
  }

  return false;
}
/**
 * 获取indexDB数据
 * @returns 数据
 */
export async function getIndexDB(): Promise<Ai[]> {
  const arr: Ai[] = [];
  await localforage.iterate((res: Ai) => {
    arr.push(res);
  });
  return arr;
}
/**
 * 获取指定id的数据
 * @param id 数据id
 * @returns 数据
 */
export async function getTryBoardById(id: string): Promise<Ai | null> {
  const res = await localforage.getItem<Ai>(id);
  return res;
}

// 获取所有对话
