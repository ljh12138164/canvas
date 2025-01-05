import * as fabric from "fabric";
import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { Board } from "../_types/board";
// import * as awarenessProtocol from "y-protocols";
import { Sessions } from "../_types/user";
import { randomColor } from "../_lib/utils";

//创建文档
const ydoc = new Y.Doc();
// const awareness = new awarenessProtocol.Awareness(ydoc);
// console.log(awareness);
interface YjsProps {
  data: Board;
  isLoading: boolean;
  canvas: fabric.Canvas | null;
  user: Sessions;
}
/**
 * ### 协同hooks
 * @param data 画板数据
 * @returns {ydoc:Y.Doc,websocket:WebsocketProvider} 文档和websocket的连接
 */
export const useYjs = ({ data, isLoading, canvas, user }: YjsProps) => {
  const [yMap] = useState<Y.Map<any>>(ydoc.getMap(`${data.id}:json`));
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
    });
    setWebsockets(websocket);
    websocket.awareness.on("update", (event) => {
      console.log(event);
    });
    return () => {
      websocket.destroy();
    };
  }, []);

  // 监听canvas事件
  useEffect(() => {
    if (!canvas) return;
    // 监听ymap
    // yMaps.observe((event) => {
    //   const data = event.keysChanged;
    //   const farbicObj = JSON.parse(
    //     (
    //       event.currentTarget._map.get([...data][0])?.content as unknown as {
    //         arr: string[];
    //       }
    //     ).arr[0]
    //   ) as fabric.Object;
    //   console.log(farbicObj);
    //   // canvas?.add(farbicObj);
    //   // canvas?.renderAll();
    //   // canvas.add(event.target);
    // });
    ydoc.on("update", (event) => {
      console.log(event);
    });
  }, [canvas]);

  // ymap监听
  useEffect(() => {
    if (isLoading) return;
    yMap.observe((event) => {
      console.log(event.target);
    });
  }, [isLoading]);
  return { ydoc, yMap, yMaps, websockets };
};
