import { Tool } from "@/types/Edit";
import * as fabric from "fabric";
import { useEffect } from "react";
interface CanvasEventProps {
  canvas: fabric.Canvas | null;
  userId: string | undefined;
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
  userId,
  save,
  setSelectedObject,
  setTool,
}: CanvasEventProps) => {
  useEffect(() => {
    if (canvas) {
      //创建
      canvas.on("object:added", () => {
        if (userId) {
          save(false, "创建图形");
        }
      });
      canvas.on("object:removed", () => {
        if (userId) {
          save(false, "删除图形");
        }
      });
      canvas.on("object:modified", () => {
        if (userId) {
          save(false, "修改图形");
        }
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
  }, [canvas, setSelectedObject, tool, setTool, userId]);
};

export default useCanvasEvent;
