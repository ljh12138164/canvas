import { useRef, useState } from "react";
import * as farbir from "fabric";
import { InitFabicObject, JSON_KEY } from "@/app/_types/Edit";
interface HistoryProps {
  canvas: farbir.Canvas | null;
  authZoom: () => Promise<void>;
  debounceMutate?: (data: {
    json: string;
    width: number;
    height: number;
  }) => void;
}

/**
 * ### 历史记录
 * @param canvas 画布
 * @param authZoom 授权缩放
 * @param debounceMutate 防抖
 */
const useHistoty = ({ canvas, authZoom, debounceMutate }: HistoryProps) => {
  // 历史记录索引
  const [historyIndex, setHitoryIndex] = useState(0);
  const canvasHistory = useRef<farbir.FabricObject[]>([]);
  const skipSave = useRef(false);
  const canUndo = () => {
    return historyIndex > 0;
  };
  const canRedo = () => {
    return historyIndex < canvasHistory.current.length - 1;
  };
  const save = (skip = false) => {
    if (!canvas) return;
    const currentState = canvas.toObject(JSON_KEY);
    //
    if (!skipSave.current && !skip) {
      canvasHistory.current.push(currentState);
      setHitoryIndex((prev) => prev + 1);
    }
    const workspace = canvas
      .getObjects()
      .find((item) => (item as InitFabicObject).name === "board");
    const width = workspace?.width || 0;
    const height = workspace?.height || 0;
    if (workspace) {
      debounceMutate?.({
        json: JSON.stringify(currentState),
        width,
        height,
      });
    }
  };
  //撤销
  const undo = async () => {
    if (canUndo()) {
      skipSave.current = true;
      //清空
      canvas?.clear();
      canvas?.renderAll();
      const previousIndex = historyIndex - 1;
      //获取上一部的json
      const previousState = canvasHistory.current[previousIndex];

      await canvas?.loadFromJSON(previousState);
      canvas?.renderAll();
      await authZoom();
      setHitoryIndex((prev) => prev - 1);
      skipSave.current = false;
    }
  };
  //重做
  const redo = async () => {
    if (canRedo()) {
      skipSave.current = true;
      //清空
      canvas?.clear();
      canvas?.renderAll();
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
  };
  return { save, canRedo, canUndo, undo, redo, setHitoryIndex, canvasHistory };
};

export default useHistoty;
