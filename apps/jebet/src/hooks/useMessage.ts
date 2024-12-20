import { useEffect, useRef, useState } from 'react';

interface UseMessageProps {
  messageLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const useMessage = ({
  messageLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseMessageProps) => {
  const [initData, setInitData] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      messageLoading ||
      !bottomRef.current ||
      !messageRef.current ||
      !topRef.current
    )
      return;
    // 判断消息的长度
    console.log(
      messageRef.current.scrollHeight,
      messageRef.current.clientHeight
    );
    if (
      !initData &&
      // 判断不在初始化状态，并且消息的高度大于消息容器的高度
      messageRef.current.scrollHeight > messageRef.current.clientHeight
    )
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setInitData(true);
  }, [messageLoading, initData]);

  // 观察者模式获取下一页
  useEffect(() => {
    if (!initData || !hasNextPage || !isFetchingNextPage || !topRef.current)
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(topRef.current);
    return () => {
      observer.disconnect();
    };
  }, [initData, hasNextPage, isFetchingNextPage, fetchNextPage]);
  return { topRef, bottomRef, messageRef };
};
