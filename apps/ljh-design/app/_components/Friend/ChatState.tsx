'use client';
import { useFrident } from '@/app/_hook/query/useFrident';
import { useUser } from '@/app/_store/auth';
import { useSocket } from '@/app/_store/chat';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '../ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

const ChatState = () => {
  const { socket } = useSocket();
  const pathName = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading } = useFrident();
  const [friendStatus, setFriendStatus] = useState<string>('idle');

  const chatId = useMemo(() => pathName.split('/').at(-1), [pathName]);

  // 监听好友状态变化
  useEffect(() => {
    if (!socket || !user?.user.id) return;

    const handleAwarenessUpdate = (data: { userId: string; status: string }) => {
      if (data.userId === chatId) {
        setFriendStatus(data.status);
      }
    };

    socket.on('awarenessUpdate', handleAwarenessUpdate);

    return () => {
      socket.off('awarenessUpdate', handleAwarenessUpdate);
    };
  }, [socket, chatId, user?.user.id]);

  const name = useMemo(() => {
    if (isLoading) return '';
    if (user?.user.id === chatId) {
      router.push('/board/friend/home');
      return '';
    }
    let name = '';

    data
      ?.filter((item) => item.isInvite)
      .forEach((item) => {
        if (item.adduser === chatId) {
          name = item.friend_profile.name;
        }
        if (item.userId === chatId) {
          name = item.user_profile.name;
        }
      });
    if (!name) router.push('/board/friend/home');
    return name;
  }, [isLoading, data, chatId, user?.user.id, router]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/board/friend/home">主页</BreadcrumbLink>
            <BreadcrumbSeparator className="block" />
            <BreadcrumbLink href="/board/friend/home">
              好友 <span className="text-black">{name}</span>
              {friendStatus === 'typing' && (
                <span className="text-gray-500 text-xs ml-2">正在输入...</span>
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
        {socket?.connected ? (
          <Badge variant="default">{'在线'}</Badge>
        ) : (
          <Badge variant="outline">{'离线'}</Badge>
        )}
      </div>
    </>
  );
};

export default ChatState;
