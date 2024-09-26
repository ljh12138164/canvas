import * as fabric from "fabric";
import { useEffect } from "react";
interface ResponseProps {
  canvas: fabric.Canvas | null;
  contain: HTMLDivElement | null;
}
const useResponse = ({ canvas, contain }: ResponseProps) => {
  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (canvas && contain) {
      resizeObserver = new ResizeObserver((entries) => {
        //设置画布大小
        canvas.setWidth(entries[0].contentRect.width);
        canvas.setHeight(entries[0].contentRect.height);

        // 获取画布中心
        const center = canvas.getCenter();
        //缩放比例
        const zoomRation = 0.85;
        //画布对象
        const localWorkspace = canvas
          .getObjects()
          .find((item) => item.name === "board");
        // 缩放

        const scale = fabric.util.findScaleToFit(localWorkspace, {
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });
        const zoom = zoomRation * scale;
        canvas.setViewportTransform(fabric.iMatrix.concat());
        canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);
        if (!localWorkspace) return;
      });
      resizeObserver.observe(contain);
    }
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvas, contain]);
};

export default useResponse;
