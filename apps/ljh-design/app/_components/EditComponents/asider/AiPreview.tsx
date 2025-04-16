import { toFabricObject } from '@/app/_lib/editor/editor';
import type { Edit } from '@/app/_types/Edit';
import * as fabric from 'fabric';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import type { AiFabricObjects } from './AiChatSider';

const AiPreview = ({
  objects,
  editor,
}: {
  objects: AiFabricObjects;
  editor: Edit | undefined;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const addObjectsToCanvas = () => {
    const obj = toFabricObject(objects);

    editor?.canvas?.add(obj as fabric.FabricObject);
    editor?.canvas?.renderAll();
    editor?.canvas?.setActiveObject(obj as fabric.FabricObject);
    toast.success('已将对象添加到画布');
  };
  useEffect(() => {
    if (!canvasRef.current || !ref.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: false,
      selectable: false,
      hasControls: false,
      selection: false, // 禁止多选
      hoverCursor: 'pointer', // 鼠标悬停时显示点击手型
      renderOnAddRemove: true,
      interactive: true, // 禁止所有交互
    });
    canvas.setDimensions({
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight,
    });
    const obj = toFabricObject(objects);
    if (!obj) return;
    obj.set({
      selectable: false,
      evented: true,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
    });
    // 获取容器尺寸
    const containerWidth = ref.current?.clientWidth ?? 79 - 10;
    const containerHeight = ref.current?.clientHeight ?? 150 - 10;
    // console.log(containerWidth, containerHeight);
    // 计算缩放比例
    const scaleX = containerWidth / obj.width!;
    const scaleY = containerHeight / obj.height!;
    const scale = Math.min(scaleX, scaleY) * 0.9;

    // // 设置group的缩放和位置
    obj.scale(scale);
    //   canvas.add(objects);
    canvas.add(obj);
    canvas.centerObject(obj);
    canvas.renderAll();
    canvas.on('mouse:down', () => {
      // 这里可以处理点击事件
      addObjectsToCanvas();
    });

    return () => {
      canvas?.dispose();
    };
  }, []);

  return (
    <div ref={ref}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default AiPreview;
