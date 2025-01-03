import { clsx, type ClassValue } from "clsx";
import * as fabric from "fabric";
import { FabricObject } from "fabric";
import { RGBColor } from "react-color";
import { Board, BoardData } from "@/app/_types/board";
import localforage from "localforage";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
localforage.config({
  name: "ljh-design",
  version: 1.0,
  storeName: "ljh-design",
});
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function rgbaObjToString(color: RGBColor | "transparent") {
  if (color === "transparent") {
    return "rgba(0, 0, 0, 0)";
  }
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a || 1})`;
}
export function isText(fabricObject: FabricObject) {
  if (!fabricObject) return false;
  return (
    fabricObject.type === "i-text" ||
    fabricObject.type === "text" ||
    fabricObject.type === "textbox"
  );
}
export type Effect = fabric.filters.BaseFilter<
  string,
  Record<string, any>
> | null;
export function createFilter(value: string): Effect {
  let effect: Effect = null;
  switch (value) {
    // 偏色
    case "polaroid":
      effect = new fabric.filters.Polaroid();
      break;
    // 褐色
    case "sepia":
      effect = new fabric.filters.Sepia();
      break;
    // 柯达
    case "kodachrome":
      effect = new fabric.filters.Kodachrome();
      break;
    // 对比度
    case "contrast":
      effect = new fabric.filters.Contrast({ contrast: 0.1 });
      break;
    // 亮度
    case "brightness":
      effect = new fabric.filters.Brightness({ brightness: 0.8 });
      break;
    // 棕色
    case "brownie":
      effect = new fabric.filters.Brownie();
      break;
    // 复古
    case "vintage":
      effect = new fabric.filters.Vintage();
      break;
    // 灰度
    case "grayscale":
      effect = new fabric.filters.Grayscale();
      break;
    // 反色
    case "invert":
      effect = new fabric.filters.Invert();
      break;
    // 技术
    case "technicolor":
      effect = new fabric.filters.Technicolor();
      break;
    // 像素化
    case "pixelate":
      effect = new fabric.filters.Pixelate();
      break;
    // 模糊
    case "blur":
      effect = new fabric.filters.Blur({ blur: 0.5 });
      break;
    // 锐化
    case "sharpen":
      effect = new fabric.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      });
      break;
    // 浮雕
    case "emboss":
      effect = new fabric.filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
      });
      break;
    // 移除颜色
    case "removecolor":
      effect = new fabric.filters.RemoveColor({
        // 设置要移除的颜色
        color: "#222",
        // 设置距离
        distance: 0.5,
        // 使用alpha通道
        useAlpha: true,
      });
      break;
    // 黑白
    case "blackwhite":
      effect = new fabric.filters.BlackWhite();
      break;
    // 饱和度
    case "vibrance":
      effect = new fabric.filters.Vibrance({
        vibrance: 10,
      });
      break;
    // 混合
    case "blendcolor":
      effect = new fabric.filters.BlendColor({
        color: "red",
        mode: "multiply",
        alpha: 1,
      });
      break;
    // 色相
    case "huerotation":
      effect = new fabric.filters.HueRotation({
        rotation: 1,
      });
      break;
    // 调整大小
    case "resize":
      effect = new fabric.filters.Resize({
        resizeType: "bilinear",
        scaleX: 1,
        scaleY: 1,
        lanczosLobes: 3,
      });
      break;
    // 饱和度
    case "saturation":
      effect = new fabric.filters.Saturation({
        saturation: 1,
      });
      break;
    // 伽马
    case "gamma":
      effect = new fabric.filters.Gamma({
        gamma: [1, 0.5, 2.1],
      });
      break;
    // 默认
    default:
      effect = null;
  }
  return effect;
}

/**
 * ## 下载文件
 * @param file
 * @param type
 */
export function downloadImage(file: string, type: string) {
  const a = document.createElement("a");
  a.href = file;
  a.download = `${nanoid()}.${type}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * 转化
 * @param objects
 * @returns
 */
export function transformToTest(objects: any) {
  if (!objects) return;
  [objects].forEach((item: any) => {
    if (item?.objects) {
      transformToTest(item.objects);
    }
  });
}
interface IndexDBChanagePros {
  type: "add" | "delete" | "edit";
  data?: Board;
  deletItem?: string;
  editData?: BoardData;
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
  const arr: Board[] = [];
  await localforage.iterate((res: Board) => {
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
  return await localforage.getItem<Board>(id);
}
