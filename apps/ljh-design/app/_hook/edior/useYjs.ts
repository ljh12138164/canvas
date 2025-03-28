// import type * as fabric from 'fabric';
// import { type RefObject, useEffect, useState } from 'react';
// import { IndexeddbPersistence } from 'y-indexeddb';
// import { WebsocketProvider } from 'y-websocket';
// import * as Y from 'yjs';
// import { getAddObject, getUserState, typeToActive } from '../../_lib/editor/editor';
// import type { DefalutUser, UserState } from '../../_types/Edit';
// import type { Board } from '../../_types/board';
// import type { Sessions } from '../../_types/user';

// //创建文档
// const ydoc = new Y.Doc();
// interface YjsProps {
//   data: Board;
//   canvas: fabric.Canvas | null;
//   user: Sessions;
//   userData: RefObject<DefalutUser>;
// }
// /**
//  * ### 协同hooks
//  * @param data 画板数据
//  * @returns {ydoc:Y.Doc,websocket:WebsocketProvider} 文档和websocket的连接
//  */
// export const useYjs = ({
//   data,
//   canvas,
//   user,
//   userData,
// }: YjsProps): {
//   ydoc: Y.Doc;
//   websockets: WebsocketProvider | null;
//   userState: [number, UserState][];
//   yMap: Y.Map<any>;
//   yMaps: Y.Map<string>;
// } => {
//   // 文档
//   const [yMap] = useState<Y.Map<any>>(ydoc.getMap(`${data.id}:json`));
//   // 用户状态
//   const [userState, setUserState] = useState<[number, UserState][]>([]);
//   // websocket
//   const [websockets, setWebsockets] = useState<WebsocketProvider | null>(null);
//   // 画布
//   const [yMaps] = useState<Y.Map<string>>(ydoc.getMap<string>(data.id));
//   // 本地降级处理
//   useEffect(() => {
//     yMap.set('json', data.json);
//     // indexDB
//     const yIndexDb = new IndexeddbPersistence(data.id, ydoc);
//     yIndexDb.clearData();
//     yIndexDb.on('synced', () => {});
//     return () => {
//       yIndexDb.destroy();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // 协同的websocke
//   useEffect(() => {
//     const websocket = new WebsocketProvider(process.env.NEXT_PUBLIC_WS_URL!, data?.id, ydoc, {
//       // 连接
//       connect: true,
//       // 最大重连时间
//       maxBackoffTime: 5000,
//       // 禁用广播通道,同源策略的
//       // disableBc: true,
//       // 连接失败
//     });
//     // 设置本地状态
//     websocket.awareness.setLocalStateField('user', userData.current);

//     setWebsockets(websocket);
//     // 设置用户状态
//     const userState = getUserState(websocket, user);

//     setUserState(userState);
//     // 监听更新
//     websocket.awareness.on('update', () => {
//       setUserState(getUserState(websocket, user));
//     });
//     return () => {
//       websocket.destroy();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // 监听canvas事件
//   useEffect(() => {
//     if (!canvas || !websockets) return;

//     // 清除初始的ymap
//     yMaps.clear();
//     // 监听doc的更新
//     ydoc.on('update', () => {
//       // console.log(event);
//     });
//     // 对map的更改
//     yMaps.observe((event) => {
//       const obj = getAddObject(event);
//       if (!obj) return;
//       const changeType = obj.changeType;
//       const fabircType = obj.FarbicType;
//       const changeClientId = obj.changeClientId;
//       // if()
//       if (user.user.id === changeClientId) return;
//       // 根据类型进行活动
//       typeToActive(changeType, obj, canvas, yMaps, fabircType);
//     });
//   }, [canvas, websockets, yMaps, user.user.id]);

//   return { ydoc, yMap, yMaps, websockets, userState };
// };
