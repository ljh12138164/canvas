import type { Board } from '@/app/_types/board';
import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import type { RGBColor } from 'react-color';
import { twMerge } from 'tailwind-merge';
import type { AiFabricObjects } from '../_components/EditComponents/asider/AiChatSider';
import type { InitFabicObject } from '../_types/Edit';
// 设置 pdf.js 工作器路径
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
// declare module 'yjs' {
//   interface AbstractStruct {
//     content: {
//       arr: any[];
//     };
//   }
// }
localforage.config({
  name: 'ljh-design',
  version: 1.0,
  storeName: 'ljh-design',
});
/**
 * 合并class
 * @param inputs 类
 * @returns 合并后的类
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * ### 将rgba对象转换为字符串
 * @param color rgba对象
 * @returns 字符串
 */
export function rgbaObjToString(color: RGBColor | 'transparent') {
  if (color === 'transparent') {
    return 'rgba(0, 0, 0, 0)';
  }
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a || 1})`;
}
/**
 * ### 判断是否是文本
 * @param fabric.FabricObject 物体
 * @returns 是否是文本
 */
export function isText(fabricObject: fabric.FabricObject) {
  if (!fabricObject) return false;
  return (
    fabricObject.type === 'i-text' ||
    fabricObject.type === 'text' ||
    fabricObject.type === 'textbox'
  );
}
/**
 * ### 滤镜类型
 * @type {Effect}
 */
export type Effect = fabric.filters.BaseFilter<string, Record<string, any>> | null;
export function createFilter(value: string): Effect {
  let effect: Effect = null;
  switch (value) {
    // 偏色
    case 'polaroid':
      effect = new fabric.filters.Polaroid();
      break;
    // 褐色
    case 'sepia':
      effect = new fabric.filters.Sepia();
      break;
    // 柯达
    case 'kodachrome':
      effect = new fabric.filters.Kodachrome();
      break;
    // 对比度
    case 'contrast':
      effect = new fabric.filters.Contrast({ contrast: 0.1 });
      break;
    // 亮度
    case 'brightness':
      effect = new fabric.filters.Brightness({ brightness: 0.8 });
      break;
    // 棕色
    case 'brownie':
      effect = new fabric.filters.Brownie();
      break;
    // 复古
    case 'vintage':
      effect = new fabric.filters.Vintage();
      break;
    // 灰度
    case 'grayscale':
      effect = new fabric.filters.Grayscale();
      break;
    // 反色
    case 'invert':
      effect = new fabric.filters.Invert();
      break;
    // 技术
    case 'technicolor':
      effect = new fabric.filters.Technicolor();
      break;
    // 像素化
    case 'pixelate':
      effect = new fabric.filters.Pixelate();
      break;
    // 模糊
    case 'blur-sm':
      effect = new fabric.filters.Blur({ blur: 0.5 });
      break;
    // 锐化
    case 'sharpen':
      effect = new fabric.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      });
      break;
    // 浮雕
    case 'emboss':
      effect = new fabric.filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
      });
      break;
    // 移除颜色
    case 'removecolor':
      effect = new fabric.filters.RemoveColor({
        // 设置要移除的颜色
        color: '#222',
        // 设置距离
        distance: 0.5,
        // 使用alpha通道
        useAlpha: true,
      });
      break;
    // 黑白
    case 'blackwhite':
      effect = new fabric.filters.BlackWhite();
      break;
    // 饱和度
    case 'vibrance':
      effect = new fabric.filters.Vibrance({
        vibrance: 10,
      });
      break;
    // 混合
    case 'blendcolor':
      effect = new fabric.filters.BlendColor({
        color: 'red',
        mode: 'multiply',
        alpha: 1,
      });
      break;
    // 色相
    case 'huerotation':
      effect = new fabric.filters.HueRotation({
        rotation: 1,
      });
      break;
    // 调整大小
    case 'resize':
      effect = new fabric.filters.Resize({
        resizeType: 'bilinear',
        scaleX: 1,
        scaleY: 1,
        lanczosLobes: 3,
      });
      break;
    // 饱和度
    case 'saturation':
      effect = new fabric.filters.Saturation({
        saturation: 1,
      });
      break;
    // 伽马
    case 'gamma':
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
  const a = document.createElement('a');
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
// export function transformToTest(objects: Record<string, any>) {
// if (!objects) return;
// for (const item of objects) {
//   if (item?.objects) {
//     transformToTest(item.objects);
//   }
// }
// }
interface IndexDBChanagePros {
  type: 'add' | 'delete' | 'edit';
  data?: Partial<Board>;
  deletItem?: string;
  editData?: Partial<Board>;
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

/**
 * 获取画布工作区
 * @param canvas 画布
 * @returns 工作区
 */
export const getWorkspace = (canvas: fabric.Canvas): fabric.Rect =>
  canvas
    .getObjects()
    .find(
      (item: InitFabicObject | fabric.FabricObject) => (item as InitFabicObject).name === 'board',
    ) as fabric.Rect;
/**
 * 通过fabric.js的JSON数据生成图片
 * @param fabrics 包含JSON数据和画布尺寸的对象
 * @returns Promise<string> 返回生成的图片base64数据
 */
export const importJsonToFabric = (fabrics: {
  json: string;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // 创建临时画布元素
      const tempCanvasEl = document.createElement('canvas');
      tempCanvasEl.id = 'temp-canvas';
      tempCanvasEl.style.display = 'none';
      document.body.appendChild(tempCanvasEl);

      // 初始化fabric画布
      const canvas = new fabric.Canvas(tempCanvasEl);
      canvas.loadFromJSON(fabrics.json);
      const { top, left, width, height } = getWorkspace(canvas);
      // 设置画布缩放
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      // 渲染完成后导出图片
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        width: width,
        height: height,
        left: left,
        top: top,
        multiplier: 1,
      });

      // 清理临时画布
      canvas.dispose();
      tempCanvasEl.remove();
      resolve(dataURL);
    } catch (error) {
      reject(error);
    }
  });
};
// 高亮色调增强
export const HIGHLIGHT_COLORS = [
  '#F59E0B',
  '#EF4444',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#D97706',
  '#EC4899',
  '#6366F1',
  '#22C55E',
  '#F97316',
  '#E11D48',
  '#2563EB',
  '#14B8A6',
  '#7C3AED',
  '#F43F5E',
  '#0EA5E9',
  '#6D28D9',
  '#047857',
  '#D946EF',
  '#0891B2',
];

/**
 * 随机颜色
 * @returns
 */
export const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

/**
 * ### 根据用户的id获取颜色
 * @param id 用户id
 * @returns 颜色
 */
export const getUserColor = (id: string) => {
  const colorsNum = String(id)
    ?.split('')
    .map((item) => item.charCodeAt(0));
  return HIGHLIGHT_COLORS[colorsNum.reduce((a, b) => a + b, 0) % HIGHLIGHT_COLORS.length];
};

/**
 * ### 获取开始到结束时间每天的数量,默认1个月
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 每天的数量
 */
export const getDateNum = (startTime?: Date, endTime?: Date) => {
  let start: Date | number | undefined = startTime;
  let end: Date | number | undefined = endTime;
  // 如果没设置开始时间，设置为1个月前
  if (!startTime && !endTime) start = dayjs().toDate().getTime() - 1000 * 60 * 60 * 24 * 30 * 1;
  // 如果没设置结束时间，设置为今天
  if (!endTime) end = dayjs().toDate();
  // 如果设置了结束时间，没有设置开始时间，设置为1个月前
  if (endTime && !startTime) start = dayjs(endTime).subtract(1, 'month').toDate();
  // 如果设置了开始时间和结束时间为同一天，则设置为开始时间
  // if (startTime && endTime && dayjs(startTime).isSame(endTime, 'day')) {
  //   end = dayjs(startTime).add(1, 'day').toDate();
  // }
  const date: string[] = [];
  let currentDate = dayjs(start);
  const endDate = dayjs(end);
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    date.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'day'); // 将结果赋值给 currentDate
  }
  // date.push(endDate.format('YYYY-MM-DD'));
  return date;
};

/**
 * ### 根据fabric.js的JSON数据生成fabric.js的对象
 * @param json fabric.js的JSON数据
 * @returns fabric.js的对象
 */
export const importJsonToFabricObject = (objects: AiFabricObjects[]) => {
  const fabricObj: fabric.Object[] = [];
  objects.forEach((obj) => {
    // 从对象中移除 type 属性，因为它在 Fabric.js 中是只读的
    const { type, ...objWithoutType } = obj;
    switch (type) {
      case 'Circle':
        fabricObj.push(new fabric.Circle(objWithoutType));
        break;
      case 'Rect':
        fabricObj.push(new fabric.Rect(objWithoutType));
        break;
      case 'Triangle':
        fabricObj.push(new fabric.Triangle(objWithoutType));
        break;
      case 'Polygon':
        if (obj.points) {
          fabricObj.push(new fabric.Polygon(obj.points, objWithoutType));
        }
        break;
      case 'Path':
        if (obj.path) {
          fabricObj.push(new fabric.Path(obj.path, objWithoutType));
        }
        break;
      case 'Textbox':
        if (obj.text) {
          const newObj = { ...objWithoutType, path: undefined, points: undefined };
          fabricObj.push(new fabric.Textbox(obj.text, newObj));
        }
        break;
    }
  });
  return fabricObj;
};
/**
 * ### 导入fabric.js的JSON数据
 * @param objects
 * @returns
 */
export const toFabricObject = (objects: AiFabricObjects) => {
  const { type, ...objWithoutType } = objects;
  switch (type) {
    case 'Circle':
      return new fabric.Circle(objWithoutType);
    case 'Rect':
      return new fabric.Rect(objWithoutType);
    case 'Triangle':
      return new fabric.Triangle(objWithoutType);
    case 'Polygon':
      if (objWithoutType.points) {
        return new fabric.Polygon(objWithoutType.points, objWithoutType);
      }
      break;
    case 'Path':
      if (objWithoutType.path) {
        return new fabric.Path(objWithoutType.path, objWithoutType);
      }
      break;
    case 'Textbox':
      if (objWithoutType.text) {
        const newObj = { ...objWithoutType, path: undefined, points: undefined };
        return new fabric.Textbox(objWithoutType.text, newObj);
      }
      break;
    default:
      return null;
  }
};
/**
 * ### 获取选中文本
 */
export function getSelectedText() {
  //   检查是否在输入框或文本域中
  const activeElement = document.activeElement;
  const isTextInput =
    activeElement &&
    (activeElement.tagName?.toLowerCase() === 'input' ||
      activeElement.tagName?.toLowerCase() === 'textarea');

  // 处理输入框或文本域中的选中文本
  if (isTextInput && 'selectionStart' in activeElement && 'selectionEnd' in activeElement) {
    const input = activeElement as HTMLInputElement | HTMLTextAreaElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    return start !== null && end !== null && start !== end ? input.value.substring(start, end) : '';
  }
  // 处理普通文本选择
  if (window.getSelection) {
    return window.getSelection()?.toString();
  }
  return '';
}

/**
 * ### 导入PDF文件并转换为图片
 * @param file PDF文件对象
 * @returns Promise<string[]> 返回PDF每页转换后的base64图片数组
 */
export async function importPDF(file: File): Promise<string[]> {
  try {
    // 读取文件
    const arrayBuffer = await file.arrayBuffer();
    // 加载PDF文档
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;
    const images: string[] = [];

    // 遍历每一页
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });

      // 创建canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) continue;

      // 渲染PDF页面到canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // 转换为图片
      const image = canvas.toDataURL('image/png');
      images.push(image);
    }

    return images;
  } catch (error) {
    console.error('PDF导入错误:', error);
    throw new Error('PDF导入失败');
  }
}

/**
 * ### 将图片转换为PDF
 * @param images 图片base64
 * @returns Promise<string> 返回PDF文件的base64数据
 */
export async function convertImagesToPDF(
  images: string,
  width: number,
  height: number,
): Promise<string> {
  try {
    // 创建一个新的PDF文档
    const pdf = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [width, height],
    });

    // 添加图片到PDF
    pdf.addImage(images, 'PNG', 0, 0, width, height);

    // 返回PDF文件的base64数据
    return pdf.output('datauristring');
  } catch (error) {
    console.error('图片转换为PDF失败:', error);
    throw new Error('图片转换为PDF失败');
  }
}
