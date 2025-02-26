import { useEffect, useRef, useState } from 'react';

interface UseMessageProps {
  messageLoading: boolean;
  messageHasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const useMessage = ({
  messageLoading,
  messageHasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseMessageProps) => {
  // 初始化数据
  const [initData, setInitData] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 记录滚动位置，用于加载更多消息后恢复位置
  // const scrollPositionRef = useRef<number>(0);
  const [isObserverActive, setIsObserverActive] = useState(false);

  // 初始化滚动到底部
  useEffect(() => {
    if (messageLoading || !bottomRef.current || !messageRef.current || !topRef.current) return;

    // 判断消息的长度
    if (
      !initData &&
      // 判断不在初始化状态，并且消息的高度大于消息容器的高度
      messageRef.current.scrollHeight > messageRef.current.clientHeight
    ) {
      // 使用 block: 'end' 确保底部消息完全可见
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      setInitData(true);
      setIsObserverActive(true); // 初始化完成后激活观察者
    }
  }, [messageLoading, initData]);

  // 优化的IntersectionObserver实现
  useEffect(() => {
    if (!topRef.current || !messageRef.current || !isObserverActive) return;

    // 创建一个新的IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!messageHasNextPage || isFetchingNextPage) {
            return;
          }
          fetchNextPage();
        }
      },
      {
        root: messageRef.current, // 指定滚动容器
        threshold: 0, // 只要有一点可见就触发
        rootMargin: '200px 0px 0px 0px', // 增加顶部边距，提前触发
      },
    );

    if (messageHasNextPage && topRef.current) {
      observer.observe(topRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isObserverActive, messageHasNextPage, isFetchingNextPage, fetchNextPage]);

  // 提供一个函数来滚动到底部
  const scrollToBottom = (options = { behavior: 'smooth' as ScrollBehavior }) => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        ...options,
        block: 'end', // 确保底部完全可见
      });
    }
  };

  // 提供一个函数来手动加载更多消息
  const loadMoreMessages = () => {
    if (!messageHasNextPage || isFetchingNextPage) return;
    // 加载更多消息
    fetchNextPage();
  };

  return { topRef, bottomRef, messageRef, scrollToBottom, loadMoreMessages };
};
