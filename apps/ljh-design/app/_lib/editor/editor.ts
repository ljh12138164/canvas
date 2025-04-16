import type { AiFabricObjects } from '@/app/_components/EditComponents/asider/AiChatSider';
import type { AddFabicObject, InitFabicObject } from '@/app/_types/Edit';
import * as fabric from 'fabric';
// import type { WebsocketProvider } from 'y-websocket';
// import type * as Y from 'yjs';
//获取画布工作区
// export const getWorkspace = (canvas: fabric.Canvas): fabric.FabricObject | undefined =>
//   canvas
//     .getObjects()
//     .find(
//       (item: InitFabicObject | fabric.FabricObject) => (item as InitFabicObject).name === 'board',
//     );
/**
 * ### 居中对象
 */
export const center = (object: fabric.FabricObject, canvas: fabric.Canvas) => {
  const workspace = getWorkspace(canvas);
  //居中
  const centers = workspace?.getCenterPoint();
  canvas._centerObject(object, centers as fabric.Point);
  canvas.renderAll();
};

/**
 * ### 获取添加的对象
 */
// export const getAddObject = (event: Y.YMapEvent<string>): AddFabicObject | null => {
//   const key = [...event.keysChanged][0];
//   // @ts-ignore
//   const value = event.target._map.get(key).content.arr?.[0];
//   if (!value) return null;
//   return JSON.parse(value);
// };
/**
 * ## 获取其他的用户state
 * @param websockets
 * @returns  [number, UserState][]
 */
// export const getUserState = (
//   websockets: WebsocketProvider,
//   user: Sessions,
// ): [number, UserState][] => {
//   return [...websockets.awareness.getStates().entries()].map((item) => [
//     item[0],
//     {
//       user: { ...item[1].user, isSelf: item[1].user.id === user.user.id },
//       select: item[1].select,
//     },
//   ]) as [number, UserState][];
// };

/**
 * ### 找到fabic对象
 * @param canvas
 * @param obj
 * @returns
 */
export const findFabicObject = (canvas: fabric.Canvas, obj: AddFabicObject) => {
  return canvas.getObjects().find((item) => item.id === obj.id);
};

// 保存单个 Group 素材
export const saveMaterial = (group: fabric.Group) => {
  // 将 group 转换为 JSON 数据
  const groupJSON = group.toObject(['id']);
  // 保存到数据库的数据结构
  const materialData = {
    json: groupJSON,
    width: group.width,
    height: group.height,
    // 其他需要的元数据
  };

  return { json: materialData, id: groupJSON.id };
};
/**
 * ### 生成素材缩略图
 * @param canvas
 * @param group
 * @returns
 */
export const genMaterialPreview = async (options: any, width: number, height: number) => {
  // 创建一个带有固定尺寸的 canvas 元素
  const canvasContainer = document.createElement('canvas');
  canvasContainer.style.width = `${width}px`;
  canvasContainer.style.height = `${height}px`;
  canvasContainer.style.backgroundColor = 'white';
  canvasContainer.style.display = 'none';
  // 将 canvas 临时添加到 DOM 中
  const canvas = new fabric.Canvas(canvasContainer, {
    controlsAboveOverlay: false,
    selectable: false,
    hasControls: false,
    selection: false, // 禁止多选
    hoverCursor: 'pointer', // 鼠标悬停时显示点击手型
    renderOnAddRemove: true,
    interactive: true, // 禁止所有交互
  });
  canvas.setDimensions({
    width,
    height,
  });
  const group = (await fabric.util.enlivenObjects([options])) as fabric.Group[];
  const groupElement = group[0];
  groupElement.set({
    selectable: false,
    evented: true,
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
  });
  // 获取容器尺寸
  const containerWidth = width;
  const containerHeight = height;
  // 计算缩放比例
  const scaleX = containerWidth / groupElement.width!;
  const scaleY = containerHeight / groupElement.height!;
  const scale = Math.min(scaleX, scaleY) * 0.9;

  // 设置group的缩放和位置
  groupElement.scale(scale);

  canvas.add(groupElement);
  canvas._centerObject(groupElement, canvas.getCenterPoint());
  canvas.renderAll();
  // 获取图片数据
  const dataURL = canvasContainer.toDataURL();

  // 清理：移除临时 canvas 元素
  canvas.dispose();
  canvasContainer.remove();

  return dataURL;
};

/**
 * ### 协同的添加
 * @description 根据类型进行活动
 */
// export const genType = (obj: AddFabicObject, fabircType: string) => {
//   switch (fabircType) {
//     case 'Rect':
//       return new fabric.Rect({
//         ...obj,
//       });
//     case 'Circle':
//       return new fabric.Circle({
//         ...obj,
//       });
//     case 'Triangle':
//       return new fabric.Triangle({
//         ...obj,
//       });
//     case 'Polygon':
//       return new fabric.Polygon(obj.points, {
//         ...obj,
//       });
//     case 'Path':
//       return new fabric.Path(obj.path as fabric.TSimplePathData, {
//         ...obj,
//         path: obj.path as fabric.TSimplePathData,
//       });
//     case 'Textbox':
//       return new fabric.Textbox(obj.text as string, {
//         id: obj.id,
//         left: obj.left,
//         top: obj.top,
//         fill: obj.fill,
//         fontSize: obj.fontSize,
//         fontFamily: obj.fontFamily,
//       });
//     default:
//       return null;
//   }
// };
/**
 * ### 根据类型进行活动
 * @param type 类型
 * @param obj 操作的对象
 * @returns
 */
// export const typeToActive = (
//   type: string,
//   obj: AddFabicObject,
//   canvas: fabric.Canvas | null,
//   yMaps: Y.Map<string>,
//   fabircType: string,
// ) => {
//   if (!canvas) return;
//   switch (type) {
//     //添加图像
//     case 'add':
//       // 生成fabric对象
//       const newObj = genType(obj, fabircType);
//       if (!newObj) return;
//       // 添加到画布
//       // canvas?.add(newObj);
//       // 居中
//       center(newObj, canvas);
//       // 渲染
//       return;
//     // 修改图像
//     case 'change':
//       return 'change';
//     // 删除图像
//     case 'delete':
//       // 找到fabric对象
//       const fabricObj = findFabicObject(canvas, obj);
//       if (!fabricObj) return;
//       // 删除对象
//       canvas?.remove(fabricObj);
//       // 渲染
//       canvas?.renderAll();
//       // 删除ymap
//       yMaps?.delete(fabricObj.id);
//       return 'delete';
//   }
// };

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
