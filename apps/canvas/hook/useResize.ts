import * as fabric from "fabric";
import { useEffect } from "react";
export function useResize(
  initCanvas: fabric.Canvas | null,
  initContainer: HTMLDivElement | null
) {
  useEffect(() => {
    //观察者模式
    let resizeObserver: ResizeObserver | null = null;
    if (initCanvas && initContainer) {
      resizeObserver = new ResizeObserver((entries) => {
        console.log(entries);
      });
    }
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [initCanvas, initContainer]);
}
