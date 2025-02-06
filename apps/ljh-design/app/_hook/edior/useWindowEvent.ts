import { useSave } from '@/app/_store/save';
import { useEffect } from 'react';

/**
 * ### 监听窗口事件
 * @returns
 */
export const useWindowEvent = () => {
  const { cloudSave } = useSave();
  useEffect(() => {
    if (cloudSave) {
      window.addEventListener('beforeunload', (event) => {
        event.returnValue = '你确定要离开';
      });
    }
  }, [cloudSave]);
};
