import { JSON_KEY } from "@/app/_types/Edit";
import { Canvas } from "fabric";
import { RefObject, useEffect, useRef } from "react";
import * as Y from "yjs";

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
  useEffect(() => {
    if (!inititaized.current && canvas && initState.current) {
      canvas.loadFromJSON(JSON.parse(initState.current), () => {
        authZoom();
        const currentState = canvas.toObject(JSON_KEY) as Canvas;
        canvasHistory.current = [currentState];
        setHistoryIndex(0);
      });
      inititaized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, authZoom]);
};
