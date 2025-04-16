import type { Board } from '@/app/_types/board';
import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
import type { RGBColor } from 'react-color';
import { twMerge } from 'tailwind-merge';
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
  // 使用padStart确保总是生成6位十六进制值
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
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
    // Dynamically import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    const { GlobalWorkerOptions } = pdfjsLib;
    // Set worker source path right before using it
    GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

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
    // Dynamically import jspdf
    const { jsPDF } = await import('jspdf');

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

/*
 * ============================================================================
 * Fabric.js 基本对象操作实现原理 (伪代码注释)
 * ============================================================================
 * 以下注释旨在概念性地解释Fabric.js内部如何处理常见的对象操作。
 * 注意：这些是原理描述，并非实际的Fabric.js源代码。
 */

/*
 * --- 精确定位 (Positioning) ---
 *
 * // 1. 用户交互 (拖拽):
 * function onObjectMouseDown(event) {
 *   targetObject = event.target;
 *   initialMousePos = getMousePosition(event);
 *   initialObjectPos = { left: targetObject.left, top: targetObject.top };
 *   isDragging = true;
 * }
 *
 * function onMouseMove(event) {
 *   if (isDragging && targetObject) {
 *     currentMousePos = getMousePosition(event);
 *     deltaX = currentMousePos.x - initialMousePos.x;
 *     deltaY = currentMousePos.y - initialMousePos.y;
 *     newLeft = initialObjectPos.left + deltaX;
 *     newTop = initialObjectPos.top + deltaY;
 *
 *     // (可选) 应用对齐逻辑
 *     alignedPosition = calculateAlignment(newLeft, newTop, targetObject);
 *
 *     // 更新对象属性
 *     targetObject.set({ left: alignedPosition.left, top: alignedPosition.top });
 *     requestRenderAll(); // 请求画布重绘
 *   }
 * }
 *
 * function onMouseUp() {
 *   if (isDragging) {
 *     isDragging = false;
 *     targetObject = null;
 *     // (可选) 触发 'object:modified' 事件
 *   }
 * }
 *
 * // 2. 编程方式设置:
 * function setObjectPosition(object, newLeft, newTop) {
 *   object.set({ left: newLeft, top: newTop });
 *   canvas.renderAll(); // 直接触发画布重绘
 * }
 */

/*
 * --- 缩放 (Scaling) ---
 *
 * // 1. 用户交互 (拖动控制点):
 * function onControlPointMouseDown(event, controlPoint) {
 *   targetObject = event.target;
 *   // ... 记录初始状态 (鼠标位置, 对象尺寸, 缩放比例, 控制点类型)
 *   isScaling = true;
 * }
 *
 * function onMouseMove(event) {
 *   if (isScaling && targetObject) {
 *     // ... 计算鼠标位移
 *     // ... 根据控制点类型和鼠标位移计算新的尺寸或缩放比例
 *     // ... (可选) 如果按住Shift键，保持等比例缩放 (scaleX = scaleY)
 *
 *     newScaleX = calculateNewScaleX(...);
 *     newScaleY = calculateNewScaleY(...);
 *
 *     // 更新对象属性
 *     targetObject.set({ scaleX: newScaleX, scaleY: newScaleY });
 *     requestRenderAll();
 *   }
 * }
 *
 * function onMouseUp() {
 *   if (isScaling) {
 *     isScaling = false;
 *     // ...
 *   }
 * }
 *
 * // 2. 编程方式设置:
 * function scaleObject(object, factor) {
 *   object.scale(factor); // 应用缩放因子
 *   canvas.renderAll();
 * }
 * function setObjectScale(object, newScaleX, newScaleY) {
 *   object.set({ scaleX: newScaleX, scaleY: newScaleY });
 *   canvas.renderAll();
 * }
 */

/*
 * --- 旋转 (Rotating) ---
 *
 * // 1. 用户交互 (拖动旋转控制点):
 * function onRotationControlMouseDown(event) {
 *   targetObject = event.target;
 *   // ... 记录初始状态 (中心点, 初始鼠标角度)
 *   isRotating = true;
 * }
 *
 * function onMouseMove(event) {
 *   if (isRotating && targetObject) {
 *     // ... 计算当前鼠标相对于对象中心的角度
 *     currentAngle = calculateAngle(getMousePosition(event), targetObject.getCenterPoint());
 *     // ... 计算旋转角度变化量
 *     deltaAngle = currentAngle - initialMouseAngle;
 *     newAngle = initialObjectAngle + deltaAngle;
 *
 *     // 更新对象属性
 *     targetObject.set({ angle: newAngle });
 *     requestRenderAll();
 *   }
 * }
 *
 * function onMouseUp() {
 *   if (isRotating) {
 *     isRotating = false;
 *     // ...
 *   }
 * }
 *
 * // 2. 编程方式设置:
 * function rotateObject(object, angleIncrement) {
 *   currentAngle = object.get('angle');
 *   object.rotate(currentAngle + angleIncrement); // Fabric.js 提供了 rotate 方法
 *   // 或者: object.set({ angle: newAngle });
 *   canvas.renderAll();
 * }
 */

/*
 * --- 填充 (Filling) ---
 *
 * // 编程方式设置:
 * function setObjectFill(object, newFill) {
 *   // newFill 可以是颜色字符串 ('#ff0000', 'rgba(...)'),
 *   // 也可以是 fabric.Gradient 或 fabric.Pattern 实例
 *   object.set({ fill: newFill });
 *   canvas.renderAll();
 * } */

/*
 * --- 描边 (Stroking) ---
 *
 * // 编程方式设置:
 * function setObjectStroke(object, options) {
 *   // options 可以包含:
 *   // stroke: 'color'       (描边颜色)
 *   // strokeWidth: number    (描边宽度)
 *   // strokeDashArray: [...] (虚线样式)
 *   // strokeLineCap: 'butt'|'round'|'square'
 *   // strokeLineJoin: 'miter'|'round'|'bevel'
 *   // ... 其他描边属性
 *   object.set(options);
 *   canvas.renderAll();
 * }
 */

// // --- 辅助函数 (示意) ---
// function getMousePosition(event: MouseEvent) {
//   /* ... 获取鼠标在画布上的坐标 ... */
// }
// function calculateAlignment(x: number, y: number, object: fabric.Object) {
//   /* ... 实现吸附逻辑 ... */ return { left: x, top: y };
// }
// function calculateAngle(point: { x: number; y: number }, center: { x: number; y: number }) {
//   /* ... 计算点相对于中心的角度 ... */
// }
// function requestRenderAll() {
//   /* ... 请求在下一帧重绘画布 (优化性能) ... */
// }
