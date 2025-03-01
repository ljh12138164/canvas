'use client';
import Emoji from '@/app/_components/Comand/ChatEmoji';
import { useFrident } from '@/app/_hook/query/useFrident';
import { useCreateMessage, useGetMessage } from '@/app/_hook/query/usechat';
import { useChat } from '@/app/_hook/use-chat';
import { useMessage } from '@/app/_hook/use-message';
import { useUser } from '@/app/_store/auth';
import { useSocket } from '@/app/_store/chat';
import type { ChatMessage } from '@/app/_types/chat';
import type { Profiles } from '@/app/_types/user';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import ChatItem from './ChatItem';
// import { useQueryClient } from '@tanstack/react-query';

const ChatMain = () => {
  const pathName = usePathname();
  const { user } = useUser();
  const { socket } = useSocket();
  // 正在输入状态
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [message, setMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  // 获取聊天对象ID
  const sendId = useMemo(() => pathName.split('/').pop(), [pathName]);
  // 获取消息历史
  const {
    message: messageHistory,
    // messageError,
    messageHasNextPage,
    isFetchingNextPage,
    // isFetchingPreviousPage,
    messageLoading,
    fetchNextPage,
    // fetchPreviousPage,
  } = useGetMessage(user?.user.id!, sendId!);
  const { createMessage, messagePending } = useCreateMessage();

  // 初始化聊天
  useChat();
  // 初始化消息
  const { topRef, bottomRef, messageRef, scrollToBottom, loadMoreMessages } = useMessage({
    messageLoading,
    messageHasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });
  // 监听新消息
  useEffect(() => {
    if (!socket || !sendId || !user?.user.id) return;

    // 创建会话ID
    const conversationId = [user.user.id, sendId].sort().join('_');
    const chatChannel = `chat:${conversationId}`;

    // 接收消息处理函数
    const handleReceiveMessage = (newMessage: ChatMessage) => {
      setLocalMessages((prev) => [...prev, newMessage]);
    };

    // 注册特定会话的消息监听
    socket.on(chatChannel, handleReceiveMessage);

    // 清理函数
    return () => {
      socket.off(chatChannel, handleReceiveMessage);
    };
  }, [socket, user?.user.id, sendId]);

  // 合并服务器消息和本地消息
  const allMessages = useMemo(() => {
    // @ts-ignore
    const serverMessages = messageHistory?.pages.flatMap((page) => page.data) || [];

    // 创建一个Map来去重，使用created_at作为键
    const messageMap = new Map<string, ChatMessage>();

    // 添加服务器消息
    // @ts-ignore
    serverMessages.forEach((msg) => {
      if (msg.created_at) {
        messageMap.set(msg.created_at, msg);
      }
    });

    // 添加本地消息，如果有相同时间戳的会覆盖服务器消息
    localMessages.forEach((msg) => {
      if (msg.created_at) {
        messageMap.set(msg.created_at, msg);
      }
    });

    // 转换回数组并按时间排序
    return Array.from(messageMap.values()).sort(
      (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime(),
    );
  }, [messageHistory, localMessages]);

  // 在 allMessages 更新时触发滚动
  useEffect(() => {
    // 只有当消息列表变化时才滚动到底部
    if (allMessages.length > 0) {
      scrollToBottom();
    }
  }, [allMessages]);

  // 发送消息
  const handleSendMessage = () => {
    if (!message.trim() || !socket || !user?.user.id || !sendId) return;
    createMessage(
      {
        json: {
          message: message.trim(),
          type: 'message',
          sendId: user.user.id,
          converId: sendId,
        },
      },
      {
        // @ts-ignore
        onSuccess: (data) => {
          socket.emit('sendMessage', data);
          setMessage(''); // 清空输入框

          // 发送消息后滚动到底部，使用 'auto' 行为以立即滚动
          setTimeout(() => {
            scrollToBottom({ behavior: 'auto' });
          }, 100);
        },
      },
    );
  };

  const addEmoji = (e: { native: string }) => {
    setMessage(message + e.native);
  };

  const router = useRouter();
  const { data, isLoading } = useFrident();

  // 获取聊天对象
  const otherUser = useMemo(() => {
    if (isLoading) return null;
    const chatId = pathName.split('/').at(-1);
    let other: Profiles | null = null;
    if (user?.user.id === chatId) {
      router.push('/board/friend/home');
      return other;
    }

    data
      ?.filter((item) => item.isInvite)
      .forEach((item) => {
        if (item.adduser === chatId) {
          other = item.friend_profile;
        }
        if (item.userId === chatId) {
          other = item.user_profile;
        }
      });

    if (!other) router.push('/board/friend/home');
    return other;
  }, [pathName, isLoading, data, user?.user.id, router]);

  // 正在输入状态
  const handleTyping = () => {
    if (!socket || !user?.user.id || !sendId) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('awareness', {
        userId: user.user.id,
        targetId: sendId,
        status: 'typing',
      });
    }

    // 清除之前的超时
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 设置新的超时
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('awareness', {
        userId: user.user.id,
        targetId: sendId,
        status: 'idle',
      });
    }, 2000);
  };

  // 监听滚动事件，加载更多消息
  useEffect(() => {
    if (!messageRef.current || messageLoading) return;

    const scrollContainer = messageRef.current;
    let isLoading = false;

    const handleScroll = () => {
      if (!messageHasNextPage || isFetchingNextPage || isLoading) return;

      // 如果滚动到顶部附近，加载更多消息
      if (scrollContainer.scrollTop < 50) {
        isLoading = true;

        // 记录当前滚动位置
        const currentScrollHeight = scrollContainer.scrollHeight;
        const currentScrollTop = scrollContainer.scrollTop;

        // 使用 Promise.resolve() 确保 fetchNextPage 返回一个 Promise
        Promise.resolve(fetchNextPage()).then(() => {
          // 加载完成后恢复滚动位置
          setTimeout(() => {
            if (scrollContainer) {
              const newScrollHeight = scrollContainer.scrollHeight;
              const heightDifference = newScrollHeight - currentScrollHeight;
              scrollContainer.scrollTop = currentScrollTop + heightDifference;
              isLoading = false;
            }
          }, 300);
        });
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [messageHasNextPage, isFetchingNextPage, messageLoading, fetchNextPage]);

  return (
    <section className="flex flex-col h-[calc(100dvh-200px)]">
      <ScrollArea className="flex-1 border-b-2 p-2" ref={messageRef}>
        <div className="h-[30px] bg-gray-100 mb-2" ref={topRef} />
        {messageHasNextPage && (
          <div className="flex justify-center my-2 sticky top-0 bg-white z-10 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // loadMoreMessages();
                fetchNextPage();
              }}
              disabled={isFetchingNextPage || messageLoading}
            >
              {isFetchingNextPage ? '加载中...' : '加载更多'}
            </Button>
          </div>
        )}
        {allMessages.map((item) => (
          <ChatItem key={item.created_at} item={item} other={otherUser!} />
        ))}
        <div className="h-[10px]" ref={bottomRef} />
      </ScrollArea>
      <footer className="h-12 flex gap-2 py-2">
        <Emoji onClick={addEmoji}>
          <Button variant="outline">🤨</Button>
        </Emoji>
        <Input
          className="flex-1"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="输入消息..."
        />
        <Button onClick={handleSendMessage} disabled={messagePending}>
          发送
        </Button>
      </footer>
    </section>
  );
};

export default ChatMain;
