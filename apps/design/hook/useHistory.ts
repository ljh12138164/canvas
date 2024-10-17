import { useMemoizedFn } from "ahooks";
import { useRef, useState } from "react";
import * as farbir from "fabric";
// import { JSON_KEY } from "@/types/Edit";
interface HistoryProps {
  canvas: farbir.Canvas | null;
}
const useHistoty = ({ canvas }: HistoryProps) => {
  const [historyIndex, setHitoryIndex] = useState(0);
  const canvasHistory = useRef<farbir.FabricObject[]>([]);
  const skipSave = useRef(false);
  const canUndo = useMemoizedFn(() => {
    return historyIndex > 0;
  });
  const canRedo = useMemoizedFn(() => {
    return historyIndex < canvasHistory.current.length - 1;
  });
  const save = useMemoizedFn((skip = false) => {
    if (!canvas) return;
    const currentState = canvas.toJSON();
    const json = currentState;
    //
    if (!skipSave.current && !skip) {
      canvasHistory.current.push(json);
      setHitoryIndex((prev) => prev + 1);
    }
    //TODO: 保存云
  });
  const undo = useMemoizedFn(async () => {
    if (canUndo()) {
      skipSave.current = true;
      //清空
      canvas?.clear();
      canvas?.renderAll();
      const previousIndex = historyIndex - 1;
      //获取上一部的json
      const previousState = canvasHistory.current[previousIndex];

      // 加载上一步的json
      await canvas?.loadFromJSON(previousState);
      canvas?.renderAll();
      setHitoryIndex((prev) => prev - 1);
      skipSave.current = false;
    }
  });
  const redo = useMemoizedFn(async () => {
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
      setHitoryIndex((prev) => prev + 1);
      skipSave.current = false;
    }
  });
  return { save, canRedo, canUndo, undo, redo, setHitoryIndex, canvasHistory };
};

export default useHistoty;
