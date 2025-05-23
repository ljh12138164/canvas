import { type InitFabicObject, JSON_KEY } from '@/app/_types/Edit';
import { useMemoizedFn } from 'ahooks';
import type * as farbir from 'fabric';
import { useRef, useState } from 'react';
interface HistoryProps {
  canvas: farbir.Canvas | null;
  authZoom: () => Promise<void>;
  debounceMutate?: (data: {
    json: string;
    width: number;
    image: string;
    height: number;
    updated_at: Date;
  }) => void;
}
const MAX_HISTORY_STEPS = 100;
/**
 * ### 历史记录
 * @param canvas 画布
 * @param authZoom 授权缩放
 * @param debounceMutate 防抖
 */
const useHistoty = ({ canvas, authZoom, debounceMutate }: HistoryProps) => {
  // 历史记录索引
  const [historyIndex, setHitoryIndex] = useState(0);
  // 历史记录
  const canvasHistory = useRef<farbir.FabricObject[]>([]);

  const skipSave = useRef(false);
  const canUndo = () => {
    return historyIndex > 0;
  };
  const canRedo = () => {
    return historyIndex < canvasHistory.current.length - 1;
  };
  const save = useMemoizedFn((skip = false) => {
    if (!canvas) return;
    const currentState = canvas.toObject(JSON_KEY);
    if (canvasHistory.current.length > MAX_HISTORY_STEPS) {
      canvasHistory.current.shift();
      setHitoryIndex((prev) => Math.max(prev - 1, 0));
    }
    //
    if (!skipSave.current && !skip) {
      canvasHistory.current.push(currentState);
      setHitoryIndex((prev) => prev + 1);
    }
    const workspace = canvas
      .getObjects()
      .find((item) => (item as InitFabicObject).name === 'board');
    const width = workspace?.width || 0;
    const height = workspace?.height || 0;
    const left = workspace?.left || 0;
    const top = workspace?.top || 0;
    if (workspace) {
      // 设置画布缩放
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      // base64
      const image = canvas.toDataURL({
        width,
        height,
        left,
        top,
        format: 'png',
        quality: 1,
        multiplier: 1,
      });
      authZoom();
      // 保存
      debounceMutate?.({
        json: currentState,
        width,
        height,
        image,
        updated_at: new Date(),
      });
    }
  });
  //撤销
  const undo = useMemoizedFn(async () => {
    if (canUndo()) {
      skipSave.current = true;
      const previousIndex = historyIndex - 1;
      //获取上一部的json
      const previousState = canvasHistory.current[previousIndex];
      await canvas?.loadFromJSON(previousState);
      canvas?.renderAll();
      await authZoom();
      setHitoryIndex((prev) => prev - 1);
      skipSave.current = false;
    }
  });
  //重做
  const redo = useMemoizedFn(async () => {
    if (canRedo()) {
      skipSave.current = true;
      const nextIndex = historyIndex + 1;
      //获取上一部的json
      const nextState = canvasHistory.current[nextIndex];
      // 加载上一步的json
      await canvas?.loadFromJSON(nextState);
      canvas?.renderAll();
      await authZoom();
      setHitoryIndex((prev) => prev + 1);
      skipSave.current = false;
    }
  });
  return { save, canRedo, canUndo, undo, redo, setHitoryIndex, canvasHistory };
};

export default useHistoty;
