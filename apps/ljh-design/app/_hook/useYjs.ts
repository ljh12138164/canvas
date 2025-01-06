import * as fabric from "fabric";
import { useEffect, useState, RefObject } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { Board } from "../_types/board";
import { randomColor } from "../_lib/utils";
import {
  getUserState,
  getAddObject,
  typeToActive,
} from "../_lib/editor/editor";
import { UserState } from "../_types/Edit";
import { Sessions } from "../_types/user";

//创建文档
const ydoc = new Y.Doc();
interface YjsProps {
  data: Board;
  canvas: fabric.Canvas | null;
  user: Sessions;
  userData: RefObject<UserState>;
}
/**
 * ### 协同hooks
 * @param data 画板数据
 * @returns {ydoc:Y.Doc,websocket:WebsocketProvider} 文档和websocket的连接
 */
export const useYjs = ({ data, canvas, user, userData }: YjsProps) => {
  const [yMap] = useState<Y.Map<any>>(ydoc.getMap(`${data.id}:json`));
  const [userState, setUserState] = useState<[number, UserState][]>([]);
  const [websockets, setWebsockets] = useState<WebsocketProvider | null>(null);
  const [yMaps] = useState<Y.Map<string>>(ydoc.getMap<string>(data.id));
  // 本地降级处理
  useEffect(() => {
    yMap.set("json", data.json);
    // indexDB
    const yIndexDb = new IndexeddbPersistence(data.id, ydoc);
    yIndexDb.clearData();
    yIndexDb.on("synced", () => {
      console.log("同步");
    });
    return () => {
      yIndexDb.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 协同
  useEffect(() => {
    const websocket = new WebsocketProvider(
      process.env.NEXT_PUBLIC_WS_URL!,
      data?.id,
      ydoc
    );
    // 设置本地状态
    websocket.awareness.setLocalStateField("user", userData.current);

    setWebsockets(websocket);
    // 设置用户状态
    const userState = getUserState(websocket);

    setUserState(userState);
    // 监听更新
    websocket.awareness.on("update", () => {
      setUserState([...websocket.awareness.getStates().entries()] as [
        number,
        UserState,
      ][]);
    });
    return () => {
      websocket.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 监听canvas事件
  useEffect(() => {
    if (!canvas || !websockets) return;
    // 清除初始的ymap
    yMaps.clear();
    // 监听doc的更新
    ydoc.on("update", () => {
      // console.log(event);
    });
    // 对map的更改
    yMaps.observe((event) => {
      console.log(event);
      const obj = getAddObject(event);
      if (!obj) return;
      const changeType = obj.changeType;
      const changeClientId = obj.changeClientId;
      // if()
      if (user.user.id === changeClientId) return;
      typeToActive(changeType, obj, canvas);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, websockets, yMaps]);

  return { ydoc, yMap, yMaps, websockets, userState };
};
