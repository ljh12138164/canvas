import { useCallback } from "react";
import * as fabric from "fabric";
const useCanvas = () => {
  const init = useCallback(
    ({
      initCanvas,
      initContainer,
    }: {
      initCanvas: fabric.Canvas;
      initContainer: HTMLDivElement;
    }) => {
      const initRect = new fabric.Rect({
        width: 1200,
        height: 800,
        name: "board",
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

export default useCanvas;
