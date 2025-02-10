import { useSave } from '@/app/_store/save';
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
  setLoading: (value: boolean) => void;
  isLoading: boolean;
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
  setLoading,
  isLoading,
}: UseLoadingStateProps) => {
  const inititaized = useRef(false);
  const { theme } = useTheme();
  const { setCloudSave } = useSave();
  useEffect(() => {
    if (!inititaized.current && canvas && initState.current) {
      (async () => {
        // 初始化画布
        await canvas.loadFromJSON(initState.current!);
        // 初始化成功后
        const currentState = canvas.toObject(JSON_KEY) as Canvas;
        canvasHistory.current = [currentState];
        setHistoryIndex(0);
        // 设置画布背景颜色
        canvas.backgroundColor = theme === 'dark' ? '#000' : '#fff';
        // 设置历史
        inititaized.current = true;
        setLoading(false);
        setCloudSave(true);
        authZoom();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, authZoom]);
  return { isLoading };
};
