import type { AddFabicObject, InitFabicObject, UserState } from '@/app/_types/Edit';
import type { Sessions } from '@/app/_types/user';
import * as fabric from 'fabric';
// import type { WebsocketProvider } from 'y-websocket';
// import type * as Y from 'yjs';
//获取画布工作区
export const getWorkspace = (canvas: fabric.Canvas) =>
  canvas
    .getObjects()
    .find(
      (item: InitFabicObject | fabric.FabricObject) => (item as InitFabicObject).name === 'board',
    );
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

  // 生成预览图
  // const clonedCanvas = new fabric.Canvas(null, {
  //   width: group.width,
  //   height: group.height
  // });
  // clonedCanvas.add(fabric.util.object.clone(group));
  // const preview = group.toDataURL();
  // 保存到数据库的数据结构
  const materialData = {
    json: groupJSON,
    // preview: preview,
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
