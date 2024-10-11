import { Tool } from "@/types/Edit";
import * as fabric from "fabric";
import { useEffect } from "react";
interface CanvasEventProps {
  canvas: fabric.Canvas | null;
  setSelectedObject: (object: fabric.Object[]) => void;
  tool: Tool;
  setTool: (tool: Tool) => void;
}

/***
 * canvas事件，创建图形（create），变更选择图形（updated），取消选择图形（cleared）
 * @param {fabric.Canvas} canvas
 */
const useCanvasEvent = ({
  canvas,
  setSelectedObject,
  tool,
  setTool,
}: CanvasEventProps) => {
  useEffect(() => {
    if (canvas) {
      //创建
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
          tool === Tool.StrokeColor ||
          tool === Tool.StrokeWidth ||
          tool === Tool.RemoveBg ||
          tool === Tool.Opacity
        )
          setTool(Tool.Select);
        setSelectedObject([]);
      });
    }
    // return () => {
    //   if (canvas) {
    //     canvas.off("selection:created");
    //     canvas.off("selection:updated");
    //     canvas.off("selection:cleared");
    //   }
    // };
  }, [canvas, setSelectedObject, tool, setTool]);
};

export default useCanvasEvent;
