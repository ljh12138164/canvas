import type { Updater } from "@tanstack/vue-query";
import { type ClassValue, clsx } from "clsx";
import localforage from "localforage";
import { twMerge } from "tailwind-merge";
import type { Ref } from "vue";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// @ts-ignore
export function valueUpdater<T extends Updater<any>>(
  updaterOrValue: T,
  ref: Ref
) {
  ref.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(ref.value)
      : updaterOrValue;
}

localforage.config({
  name: "ljh-form",
  storeName: "ljh-form",
});

interface IndexDBChanagePros {
  type: "add" | "delete" | "edit";
  data?: {
    id: string;
    schema: string;
  };
  deletItem?: string;
  editData?: {
    id: string;
    schema: string;
  };
}
/**
 * 更新indexDB
 * @param type 类型
 * @param data 数据
 * @param deletItem 删除的id
 * @param editData 编辑的数据
 * @returns
 */
export function indexDBChange({
  type,
  data,
  deletItem,
  editData,
}: IndexDBChanagePros) {
  if (type === "delete" && deletItem) {
    return localforage.removeItem(deletItem);
  }
  if (type === "add" && data) {
    return localforage.setItem(data.id, data);
  }
  if (type === "edit" && editData) {
    localforage.removeItem(editData.id);
    return localforage.setItem(editData.id, editData);
  }
}
/**
 * 获取indexDB数据
 * @returns 数据
 */
export async function getIndexDB() {
  const arr: { id: string; schema: string }[] = [];
  await localforage.iterate((res: { id: string; schema: string }) => {
    arr.push(res);
  });
  return arr;
}
/**
 * 获取指定id的数据
 * @param id 数据id
 * @returns 数据
 */
export async function getFormDataById(id: string) {
  return await localforage.getItem<{ id: string; schema: string }>(id);
}
