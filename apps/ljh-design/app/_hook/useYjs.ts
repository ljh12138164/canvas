import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Board } from "../_types/board";
import { flushSync } from "react-dom";
import * as fabric from "fabric";
import { nanoid } from "nanoid";
//创建文档
const ydoc = new Y.Doc();
interface YjsProps {
  data: Board;
  isLoading: boolean;
  canvas: fabric.Canvas | null;
}
/**
 * ### 协同hooks
 * @param data 画板数据
 * @returns {ydoc:Y.Doc,websocket:WebsocketProvider} 文档和websocket的连接
 */
export const useYjs = ({ data, isLoading, canvas }: YjsProps) => {
  const [websocket, setWebsocket] = useState<WebsocketProvider | null>(null);
  const [yMap] = useState<Y.Map<any>>(ydoc.getMap(`${data.id}:json`));
  // 本地降级处理
  useEffect(() => {
    yMap.set("json", data.json);
    // indexDB
    const yIndexDb = new IndexeddbPersistence(data.id, ydoc);
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
    setWebsocket(websocket);

    return () => {
      websocket.destroy();
    };
  }, []);

  // 监听canvas事件
  useEffect(() => {
    if (!canvas || !websocket) return;
    websocket.on(`add:${data.id}`, (item: fabric.Object) => {
      canvas?.add(item);
      yMap.set(`add-${nanoid()}`, item);
    });
  }, [canvas]);

  // ymap监听
  useEffect(() => {
    if (isLoading) return;
    yMap.observe((event) => {
      console.log(event.target);
    });
  }, [isLoading]);
  return { ydoc, websocket, yMap };
};
