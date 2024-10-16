import { useMemoizedFn } from "ahooks";
import { useRef, useState } from "react";
import * as farbir from "fabric";
interface HistoryProps {
  canvas: farbir.Canvas | null;
}
const useHistoty = ({ canvas }: HistoryProps) => {
  const [historyIndex, setHitoryIndex] = useState(0);
  const canvasHistory = useRef<string[]>([]);
  const skipSave = useRef(false);
  const canUndo = useMemoizedFn(() => {
    return historyIndex > 0;
  });
  const canRedo = useMemoizedFn(() => {
    return historyIndex < canvasHistory.current.length - 1;
  });
  const save = useMemoizedFn(() => {
    if (!canvas) return;
    const currentState = canvas.toJSON();
    console.log(currentState);
    const json = JSON.stringify(currentState);
    if (!skipSave.current) {
      canvasHistory.current.push(json);
      setHitoryIndex((prev) => prev + 1);
    }
  });
  return { save };
};

export default useHistoty;
