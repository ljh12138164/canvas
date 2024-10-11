import * as fabric from "fabric";
import { useEffect } from "react";
interface ResponseProps {
  canvas: fabric.Canvas | null;
  contain: HTMLDivElement | null;
}
/**
 *
 * @param param 0 canvas 画布ref
 * @param contain 容器ref
 */
const useResponse = ({ canvas, contain }: ResponseProps) => {
  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (canvas && contain) {
      resizeObserver = new ResizeObserver(async (entries) => {
        //设置画布大小
        canvas.width = entries[0].contentRect.width;
        canvas.height = entries[0].contentRect.height;

        // 获取画布中心
        const center = canvas.getCenterPoint();
        //缩放比例
        const zoomRation = 0.85;
        //画布对象
        const localWorkspace = canvas
          .getObjects()
          //@ts-ignore
          .find((item: fabric.SerializedObjectProps) => item.name === "board");
        // 缩放

        if (!localWorkspace) return;
        const scale = fabric.util.findScaleToFit(localWorkspace, {
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });

        const zoom = zoomRation * scale;
        canvas.setViewportTransform(fabric.iMatrix.concat() as fabric.TMat2D);
        canvas.zoomToPoint(new fabric.Point(center.x, center.y), zoom);
        const workspace = localWorkspace.getCenterPoint();
        const viewportTransform = canvas.viewportTransform;
        if (
          canvas.width === undefined ||
          canvas.height === undefined ||
          !viewportTransform
        ) {
          return;
        }
        //设置画布位置
        viewportTransform[4] =
          canvas.width / 2 - workspace.x * viewportTransform?.[0] - 30;
        //@ts-ignore
        viewportTransform[5] =
          canvas.height / 2 - workspace.y * viewportTransform?.[3];
        canvas.setViewportTransform(viewportTransform);
        //重新渲染
        const data = await localWorkspace.clone();
        canvas.clipPath = data;
        canvas.renderAll();
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
