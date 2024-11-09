import { JSON_KEY } from "@/types/Edit";
import { Canvas } from "fabric";
import { RefObject, useEffect, useRef } from "react";

type UseLoadingStateProps = {
  authZoom: () => void;
  canvas: Canvas | null;
  initState: RefObject<string>;
  canvasHistory: RefObject<object[]>;
  setHistoryIndex: (value: number) => void;
};

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
        const currentState = canvas.toObject(JSON_KEY);
        canvasHistory.current = [currentState];
        setHistoryIndex(0);
      });
      inititaized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, authZoom]);
};
