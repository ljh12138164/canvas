import { JSON_KEY } from '@/app/_types/Edit';
import type { Canvas } from 'fabric';
import { useTheme } from 'next-themes';
import { type RefObject, useEffect, useRef, useState } from 'react';

type UseLoadingStateProps = {
  authZoom: () => void;
  canvas: Canvas | null;
  initState: RefObject<string | undefined>;
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
  const { theme } = useTheme();
  const [isLoading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!inititaized.current && canvas && initState.current) {
      // 初始化画布
      canvas.loadFromJSON(initState.current, () => {
        authZoom();
        const currentState = canvas.toObject(JSON_KEY) as Canvas;
        canvasHistory.current = [currentState];
        // 设置画布背景颜色
        canvas.backgroundColor = theme === 'dark' ? '#000' : '#fff';
        // 设置历史
        setHistoryIndex(0);
      });
      inititaized.current = true;
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, authZoom]);
  return { isLoading };
};
