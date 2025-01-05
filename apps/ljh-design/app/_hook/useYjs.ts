import * as fabric from "fabric";
import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { Board } from "../_types/board";
import { getAddObject, randomColor } from "../_lib/utils";
import { UserState } from "../_types/Edit";
import { Sessions } from "../_types/user";

//创建文档
const ydoc = new Y.Doc();
interface YjsProps {
  data: Board;
  canvas: fabric.Canvas | null;
  user: Sessions;
}
/**
 * ### 协同hooks
 * @param data 画板数据
 * @returns {ydoc:Y.Doc,websocket:WebsocketProvider} 文档和websocket的连接
 */
export const useYjs = ({ data, canvas, user }: YjsProps) => {
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
      data.id,
      ydoc
    );
    // 设置本地状态
    websocket.awareness.setLocalState({
      name: user.user.user_metadata.name,
      color: randomColor(),
      clientId: websocket.awareness.clientID,
      image: user.user.user_metadata.image,
      select: [],
    });
    setWebsockets(websocket);
    // 设置用户状态
    setUserState(
      [...(websocket.awareness.getStates()?.entries() || [])].map((item) => [
        item[0],
        { ...item[1], isSelf: item[0] === websocket.awareness.clientID },
      ]) as [number, UserState][]
    );
    // 监听更新
    websocket.awareness.on("update", () => {
      setUserState(
        [...(websocket.awareness.getStates()?.entries() || [])].map((item) => [
          item[0],
          { ...item[1], isSelf: item[0] === websocket.awareness.clientID },
        ]) as [number, UserState][]
      );
    });
    return () => {
      websocket.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 监听canvas事件
  useEffect(() => {
    if (!canvas) return;
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
      const changeType = obj.changeType;
      const changeClientId = obj.changeClientId;
      console.log(changeType, changeClientId);
      // const getType=obj.
      // if (addObject) {
      //   canvas.add(addObject);
      // }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  return { ydoc, yMap, yMaps, websockets, userState };
};
