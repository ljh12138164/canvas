import { Tool, UserState } from "@/app/_types/Edit";
import * as fabric from "fabric";
import { useEffect } from "react";
import { WebsocketProvider } from "y-websocket";
interface CanvasEventProps {
  canvas: fabric.Canvas | null;
  tool: Tool;
  setSelectedObject: (object: fabric.Object[]) => void;
  setTool: (tool: Tool) => void;
  save: (skip?: boolean, des?: string) => void;
  websockets: WebsocketProvider | null;
}

/***
 * canvas事件，创建图形（create），变更选择图形（updated），取消选择图形（cleared）
 * @param {fabric.Canvas} canvas
 */
const useCanvasEvent = ({
  canvas,
  tool,
  save,
  setSelectedObject,
  setTool,
  websockets,
}: CanvasEventProps) => {
  useEffect(() => {
    if (canvas) {
      // 不能用添加对象，因为初始化添加对象时，
      // canvas.on("object:added", () => {
      // 添加到ymap
      // yMaps?.set(
      //   item.target.id,
      //   JSON.stringify({ ...item.target, changeType: "add" })
      // );
      // yMap.set("json", canvas.toJSON());
      // save();
      // });
      canvas.on("object:removed", () => {
        // 从ymap中删除
        // yMaps?.delete(item.target.id);
        // websocket?.emit("remove", [item]);
        // console.log(item);
        // yMap.set("json", canvas.toJSON());
        // save();
      });
      canvas.on("object:modified", () => {
        // websocket?.emit("update", [item]);
        // 更新ymap
        // yMaps?.set(item.target.id, item.target);
        // console.log(item);
        // yMap.set("json", canvas.toJSON());
        // save();
      });
      // 选择
      canvas.on("selection:created", (e) => {
        // 更新用户状态
        websockets?.awareness.setLocalState(
          [...(websockets?.awareness.getStates()?.entries() || [])].map(
            (item) => {
              if (item[1].clientId === websockets?.awareness.clientID) {
                return [
                  item[0],
                  {
                    ...item[1],
                    select: canvas.getActiveObjects(),
                  },
                ];
              }
              return item;
            }
          ) as [number, UserState][]
        );
        setSelectedObject(e.selected || []);
      });

      // 更新选择
      canvas.on("selection:updated", (e) => {
        // 更新用户状态
        websockets?.awareness.setLocalState(
          [...(websockets?.awareness.getStates()?.entries() || [])].map(
            (item) => {
              if (item[1].clientId === websockets?.awareness.clientID) {
                return [
                  item[0],
                  {
                    ...item[1],
                    select: canvas.getActiveObjects().map((item) => item.id),
                  },
                ];
              }
              return item;
            }
          ) as [number, UserState][]
        );
        setSelectedObject(e.selected || []);
      });

      // 清除选择
      canvas.on("selection:cleared", () => {
        // 更新用户状态
        websockets?.awareness.setLocalState(
          [...(websockets?.awareness.getStates()?.entries() || [])].map(
            (item) => {
              if (item[1].clientId === websockets?.awareness.clientID) {
                return [item[0], { ...item[1], select: [] }];
              }
              return item;
            }
          ) as [number, UserState][]
        );
        if (
          tool == Tool.Font ||
          tool === Tool.Fill ||
          tool === Tool.Filter ||
          tool === Tool.FilterSetting ||
          tool === Tool.StrokeColor ||
          tool === Tool.StrokeWidth ||
          tool === Tool.RemoveBg ||
          tool === Tool.Opacity
        )
          setTool(Tool.Select);
        setSelectedObject([]);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);
};

export default useCanvasEvent;
