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
      const initRect = new fabric.Rect({
        width: 900,
        height: 600,
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
        width: 100,
        height: 100,
        name: "rect",
        fill: "red",
        selectable: true,
        hasControls: true,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });
      initCanvas.add(initRect);
      initCanvas.add(rect);
      initCanvas.centerObject(initRect);
      initCanvas.width = initContainer.offsetWidth;
      initCanvas.height = initContainer.offsetHeight;
      //溢出不显示
      initCanvas.clipPath = initRect;
    },
    []
  );
  return { init };
};
