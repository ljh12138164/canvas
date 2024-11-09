import { STROKE_COLOR, STROKE_WIDTH } from '@/types/Edit';
import * as fabric from 'fabric';
import { useMemoizedFn } from 'ahooks';
const useCanvas = () => {
  const init = useMemoizedFn(
    ({
      initCanvas,
      initContainer,
    }: {
      initCanvas: fabric.Canvas;
      initContainer: HTMLDivElement;
    }) => {
      fabric.FabricObject.prototype.set({
        cornerColor: '#FFF',
        cornerStyle: 'circle',
        borderColor: '#3b82f6',
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: '#3b82f6',
      });
      //初始化画布笔画
      initCanvas.freeDrawingBrush = new fabric.PencilBrush(initCanvas);
      initCanvas.freeDrawingBrush.width = STROKE_WIDTH;
      initCanvas.freeDrawingBrush.color = STROKE_COLOR;
      //画布
      const initRect = new fabric.Rect({
        width: 800,
        height: 1100,
        name: 'board',
        fill: 'white',
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.8)',
          blur: 5,
        }),
      });
      //添加滤镜数组
      fabric.FabricImage.prototype.filtersArray = [];

      const welcomeText = new fabric.FabricText('欢迎使用', {
        fill: 'black',
        fontFamily: 'Arial',
        fontSize: 60,
        name: 'welcome',
      });
      const rect = new fabric.Rect({
        width: 50,
        height: 50,
        name: 'rect',
        fill: 'black',
      });

      initCanvas.add(initRect);
      initCanvas.add(rect);
      initCanvas.add(welcomeText);
      initCanvas.centerObject(initRect);
      initCanvas.centerObject(rect);
      initCanvas.centerObject(welcomeText);
      initCanvas.setWidth(initContainer.offsetWidth);
      initCanvas.setHeight(initContainer.offsetHeight);
      //溢出不显示
      initCanvas.clipPath = initRect;
    }
  );

  return { init };
};

export default useCanvas;
