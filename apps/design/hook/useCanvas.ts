import { useMemoizedFn } from "ahooks";
import * as fabric from "fabric";

const useCanvas = () => {
  const init = useMemoizedFn(
    ({
      initCanvas,
      initContainer,
    }: {
      initCanvas: fabric.Canvas;
      initContainer: HTMLDivElement;
    }) => {
      const initRect = new fabric.Rect({
        width: 500,
        height: 600,
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
        width: 50,
        height: 50,
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
