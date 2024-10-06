import * as fabric from "fabric";
import { useEffect } from "react";
interface CanvasEventProps {
  canvas: fabric.Canvas | null;
  setSelectedObject: (object: fabric.Object[]) => void;
}

/***
 * canvas事件，创建图形（create），变更选择图形（updated），取消选择图形（cleared）
 * @param {fabric.Canvas} canvas
 */
const useCanvasEvent = ({ canvas, setSelectedObject }: CanvasEventProps) => {
  useEffect(() => {
    console.log(canvas);
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
        setSelectedObject([]);
      });
    }
    return () => {
      if (canvas) {
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
      }
    };
  }, [canvas, setSelectedObject]);
};

export default useCanvasEvent;
