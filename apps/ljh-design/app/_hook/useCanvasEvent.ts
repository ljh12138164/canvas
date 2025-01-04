import { Tool } from "@/app/_types/Edit";
import * as fabric from "fabric";
import { useEffect } from "react";
import { WebsocketProvider } from "y-websocket";
interface CanvasEventProps {
  canvas: fabric.Canvas | null;
  tool: Tool;
  setSelectedObject: (object: fabric.Object[]) => void;
  setTool: (tool: Tool) => void;
  save: (skip?: boolean, des?: string) => void;
  websocket: WebsocketProvider | null;
  isLoading: boolean;
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
  websocket,
  isLoading,
}: CanvasEventProps) => {
  useEffect(() => {
    if (canvas && !isLoading) {
      // 添加对象
      canvas.on("object:added", (item) => {
        // console.log(item);
        websocket?.emit("add", [item]);
        // yMap.set("json", canvas.toJSON());
        // save();
      });
      canvas.on("object:removed", (item) => {
        websocket?.emit("remove", [item]);
        // console.log(item);
        // yMap.set("json", canvas.toJSON());
        // save();
      });
      canvas.on("object:modified", (item) => {
        websocket?.emit("update", [item]);
        // console.log(item);
        // yMap.set("json", canvas.toJSON());
        // save();
      });
      canvas.on("selection:created", (e) => {
        websocket?.emit("select", [e.selected || []]);
        console.log(e);
        setSelectedObject(e.selected || []);
      });
      //更新
      canvas.on("selection:updated", (e) => {
        console.log(e);
        setSelectedObject(e.selected || []);
      });
      //删除
      canvas.on("selection:cleared", (e) => {
        console.log(e);
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
  }, [canvas, isLoading]);
};

export default useCanvasEvent;
