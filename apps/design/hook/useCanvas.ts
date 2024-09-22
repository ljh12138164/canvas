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
      initCanvas.add(initRect);
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

export default useCanvas;
