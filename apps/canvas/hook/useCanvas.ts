import { useCallback } from "react";
import * as fabric from "fabric";
export const useCanvas = () => {
  const init = useCallback(
    ({
      initCanvas,
      initContainer,
    }: {
      initCanvas: fabric.Canvas;
      initContainer: HTMLDivElement;
    }) => {
      //图层

      const initRect = new fabric.Rect({
        width: 1050,
        height: 700,
        name: "rect",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });
      const rect = new fabric.Rect({
        width: 300,
        height: 300,
        name: "rect",
        fill: "black",
      });
      initCanvas.add(initRect);
      initCanvas.add(rect);
      initCanvas.centerObject(initRect);
      initCanvas.centerObject(rect);
      initCanvas.width = initContainer.offsetWidth;
      initCanvas.height = initContainer.offsetHeight;
      //溢出不显示
      initCanvas.clipPath = initRect;
    },
    []
  );
  return { init };
};
