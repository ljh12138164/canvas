import { JSON_KEY } from "@/app/_types/Edit";
import { Canvas } from "fabric";
import { RefObject, useEffect, useRef, useState } from "react";

type UseLoadingStateProps = {
  authZoom: () => void;
  canvas: Canvas | null;
  initState: RefObject<string>;
  canvasHistory: RefObject<object[]>;
  setHistoryIndex: (value: number) => void;
};
/**
 * ### 初始化画布
 * @param param0
 */
export const useLoading = ({
  authZoom,
  canvas,
  initState,
  canvasHistory,
  setHistoryIndex,
}: UseLoadingStateProps) => {
  const inititaized = useRef(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!inititaized.current && canvas && initState.current) {
      // 初始化画布
      canvas.loadFromJSON(JSON.parse(initState.current), () => {
        authZoom();
        const currentState = canvas.toObject(JSON_KEY) as Canvas;
        canvasHistory.current = [currentState];

        // 设置历史
        setHistoryIndex(0);
      });
      inititaized.current = true;
      const timer = setTimeout(() => {
        setLoading(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, authZoom]);
  return { isLoading };
};
