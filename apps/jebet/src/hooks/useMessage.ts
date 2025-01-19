import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (
      messageLoading ||
      !bottomRef.current ||
      !messageRef.current ||
      !topRef.current
    )
      return;
    // 判断消息的长度
    // let timer: NodeJS.Timeout;
    if (
      !initData &&
      // 判断不在初始化状态，并且消息的高度大于消息容器的高度
      messageRef.current.scrollHeight > messageRef.current.clientHeight
    ) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setInitData(true);
      // timer = setTimeout(() => {
      //   setInitData(true);
      // }, 1000);
    }
    // return () => clearTimeout(timer);
  }, [messageLoading, initData]);

  // 观察者模式获取下一页
  useEffect(() => {
    if (!topRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!messageHasNextPage || isFetchingNextPage || !initData) return;
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    if (messageHasNextPage) observer.observe(topRef.current);
    return () => {
      observer.disconnect();
    };
  }, [initData, messageHasNextPage, isFetchingNextPage, fetchNextPage]);

  return { topRef, bottomRef, messageRef };
};
