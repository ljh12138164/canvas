import { useEffect, useRef } from 'react';

interface Information {
  disabled: boolean;
  option?: IntersectionObserverInit;
  fetchNextPage: () => void;
}

/**
 * ### 无限加载
 * @returns
 */
export const useInformation = ({ disabled, option, fetchNextPage }: Information) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!bottomRef.current) return;
    const fetchs = ([entry]: IntersectionObserverEntry[]) => {
      if (!entry.isIntersecting) return;
      if (disabled) return;
      fetchNextPage();
    };
    const observe = new IntersectionObserver(fetchs, option);
    // 监听
    observe.observe(bottomRef.current);
    return () => {
      observe.disconnect();
    };
  }, []);
  return bottomRef;
};
