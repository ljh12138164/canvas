import type { MaterialResponseType } from '@/app/_hook/query/useMaterial';
import type { Edit } from '@/app/_types/Edit';
import * as fabric from 'fabric';
import { useEffect, useRef } from 'react';

export const MeterialList = ({
  item,
  editor,
}: { item: MaterialResponseType[number]; editor?: Edit | undefined }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: false,
      selectable: false,
      hasControls: false,
      selection: false,
      hoverCursor: 'pointer',
      renderOnAddRemove: true,
      interactive: true,
    });
    canvas.setDimensions({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });
    (async () => {
      const group = (await fabric.util.enlivenObjects([item.options])) as fabric.Group[];
      const groupElement = group[0];
      groupElement.set({
        selectable: false,
        evented: true,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
      });
      // 获取容器尺寸
      const containerWidth = containerRef.current?.clientWidth ?? 79 - 10;
      const containerHeight = containerRef.current?.clientHeight ?? 150 - 10;
      // 计算缩放比例
      const scaleX = containerWidth / groupElement.width!;
      const scaleY = containerHeight / groupElement.height!;
      const scale = Math.min(scaleX, scaleY) * 0.9;

      // 设置group的缩放和位置
      groupElement.scale(scale);

      canvas.add(groupElement);
      canvas._centerObject(groupElement, canvas.getCenterPoint());
      canvas.renderAll();
    })();

    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <div className="flex items-center justify-between">
      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger> */}
      <section
        className="w-full h-full border cursor-pointer"
        ref={containerRef}
        onClick={() => {
          editor?.addMaterial(
            item.options as unknown as Pick<
              Omit<
                fabric.GroupProps & fabric.TClassProperties<fabric.Group>,
                keyof fabric.SerializedGroupProps
              >,
              'id'
            > &
              fabric.SerializedGroupProps,
          );
        }}
      >
        <canvas ref={canvasRef} />
      </section>
      {/* </TooltipTrigger>
          <TooltipContent>
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
    </div>
  );
};
