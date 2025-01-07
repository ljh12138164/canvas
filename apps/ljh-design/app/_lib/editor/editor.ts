import {
  AddFabicObject,
  InitFabicObject,
  UserState,
  YjsObject,
} from '@/app/_types/Edit';
import { Sessions } from '@/app/_types/user';
import * as fabric from 'fabric';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
//获取画布工作区
export const getWorkspace = (canvas: fabric.Canvas) =>
  canvas
    .getObjects()
    .find(
      (item: InitFabicObject | fabric.FabricObject) =>
        (item as InitFabicObject).name === 'board'
    );
/**
 * ### 居中对象
 */
export const center = (object: fabric.Object, canvas: fabric.Canvas) => {
  const workspace = getWorkspace(canvas);
  //居中
  const centers = workspace?.getCenterPoint();
  canvas._centerObject(object, centers as fabric.Point);
};

/**
 * ### 获取添加的对象
 */
export const getAddObject = (
  event: Y.YMapEvent<string>
): AddFabicObject | null => {
  const key = [...event.keysChanged][0];
  // @ts-ignore
  const value = (event.target._map.get(key)?.content).arr?.[0];
  if (!value) return null;
  return JSON.parse(value);
};
/**
 * ## 获取其他的用户state
 * @param websockets
 * @returns  [number, UserState][]
 */
export const getUserState = (
  websockets: WebsocketProvider,
  user: Sessions
): [number, UserState][] => {
  return [...websockets.awareness.getStates()?.entries()].map((item) => [
    item[0],
    {
      user: { ...item[1].user, isSelf: item[1].user.id === user.user.id },
      select: item[1].select,
    },
  ]) as [number, UserState][];
};

/**
 * ### 协同的添加
 * @description 根据类型进行活动
 */
export const genType = (obj: AddFabicObject) => {
  switch (obj.type) {
    case 'Rect':
      return new fabric.Rect({
        ...obj,
      });
    case 'Circle':
      return new fabric.Circle({
        ...obj,
      });
    case 'Triangle':
      return new fabric.Triangle({
        ...obj,
      });
    case 'Polygon':
      const points = obj.points;
      return new fabric.Polygon(points, {
        ...obj,
      });
  }
};

/**
 * ### 根据类型进行活动
 * @param type 类型
 * @param obj 操作的对象
 * @returns
 */
export const typeToActive = (
  type: string,
  obj: AddFabicObject,
  canvas: fabric.Canvas | null
) => {
  if (!canvas) return;
  switch (type) {
    //添加图像
    case 'add':
      const newObj = genType(obj);
      if (!newObj) return;
      canvas?.add(newObj);
      canvas?.renderAll();
      center(newObj, canvas);
      return;
    // 修改图像
    case 'change':
      return 'change';
    // 删除图像
    case 'delete':
      return 'delete';
  }
};
