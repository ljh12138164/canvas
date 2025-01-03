import { Tool } from "@/app/_types/Edit";
import * as fabric from "fabric";
import { useEffect } from "react";
interface CanvasEventProps {
  canvas: fabric.Canvas | null;
  tool: Tool;
  setSelectedObject: (object: fabric.Object[]) => void;
  setTool: (tool: Tool) => void;
  save: (skip?: boolean, des?: string) => void;
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
}: CanvasEventProps) => {
  useEffect(() => {
    if (canvas) {
      //创建
      canvas.on("object:added", () => {
        save();
      });
      canvas.on("object:removed", () => {
        save();
      });
      canvas.on("object:modified", () => {
        save();
      });
      canvas.on("selection:created", (e) => {
        setSelectedObject(e.selected || []);
      });
      //更新
      canvas.on("selection:updated", (e) => {
        setSelectedObject(e.selected || []);
      });
      //删除
      canvas.on("selection:cleared", () => {
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
