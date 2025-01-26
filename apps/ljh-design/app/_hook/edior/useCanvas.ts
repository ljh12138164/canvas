import { STROKE_COLOR, STROKE_WIDTH } from '@/app/_types/Edit';
import { useMemoizedFn } from 'ahooks';
import * as fabric from 'fabric';
import { useTheme } from 'next-themes';
import type { RefObject } from 'react';

interface CanvasProps {
  initWidth?: RefObject<number> | number;
  initHeight?: RefObject<number> | number;
}
const useCanvas = ({ initWidth, initHeight }: CanvasProps) => {
  const { theme } = useTheme();
  const init = useMemoizedFn(
    ({
      initCanvas,
      initContainer,
    }: {
      initCanvas: fabric.Canvas;
      initContainer: HTMLDivElement;
    }) => {
      fabric.FabricObject.prototype.set({
        cornerColor: theme === 'dark' ? '#fff' : '#3b82f6',
        cornerStyle: 'circle',
        borderColor: theme === 'dark' ? '#fff' : '#3b82f6',
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: theme === 'dark' ? '#fff' : '#3b82f6',
      });
      //初始化画布笔画
      initCanvas.freeDrawingBrush = new fabric.PencilBrush(initCanvas);
      initCanvas.freeDrawingBrush.width = STROKE_WIDTH;
      initCanvas.freeDrawingBrush.color = STROKE_COLOR;
      //画布
      const initRect = new fabric.Rect({
        width: typeof initWidth === 'number' ? initWidth : initWidth?.current || 800,
        height: typeof initHeight === 'number' ? initHeight : initHeight?.current || 1100,
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

      initCanvas.add(initRect);
      initCanvas.centerObject(initRect);
      // 设置画布尺寸
      initCanvas.setDimensions({
        width: initContainer.offsetWidth,
        height: initContainer.offsetHeight,
      });
      // 设置画布背景颜色
      //溢出不显示
      initCanvas.clipPath = initRect;
    },
  );

  return { init };
};

export default useCanvas;
