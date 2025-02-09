import { useSave } from '@/app/_store/save';
import type { Edit } from '@/app/_types/Edit';
import { useEffect } from 'react';

/**
 * ### 监听窗口事件
 * @returns
 */
export const useWindowEvent = (editor: Edit | undefined) => {
  const { cloudSave } = useSave();
  useEffect(() => {
    const handleZoom = (e: WheelEvent, deltaY: number) => {
      if (e.ctrlKey) {
        // 放大
        if (deltaY < 0) {
          editor?.zoomIn();
          // 缩小
        } else {
          editor?.zoomOut();
        }
      }
    };
    const abortController = new AbortController();
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!cloudSave) {
        // 如果有未保存的更改,显示提示
        e.preventDefault();
        e.returnValue = '您有未保存的更改,确定要离开吗?';
      }
    };
    if (!cloudSave) {
      window.addEventListener('beforeunload', handleBeforeUnload, {
        signal: abortController.signal,
      });
    }
    // 监听窗口大小改变

    // 监听浏览器缩放
    window.addEventListener(
      'wheel',
      (e) => {
        const { deltaY } = e;
        if (e.ctrlKey) {
          e.preventDefault();
          handleZoom(e, deltaY);
        }
      },
      { passive: false, signal: abortController.signal },
    );
    return () => {
      abortController.abort();
    };
  }, [cloudSave]);
};
