'use client';
import { useFrident } from '@/app/_hook/query/useFrident';
import { useUser } from '@/app/_store/auth';
import { useSocket } from '@/app/_store/chat';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
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

  const name = useMemo(() => {
    if (isLoading) return '';
    const chatId = pathName.split('/').at(-1);
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
  }, []);
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/board/friend/home">主页</BreadcrumbLink>
            <BreadcrumbSeparator className="block" />
            <BreadcrumbLink href="/board/friend/home">
              好友 <span className="text-black">{name}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
        {socket ? (
          <Badge variant="default">{'在线'}</Badge>
        ) : (
          <Badge variant="outline">{'离线'}</Badge>
        )}
      </div>
    </>
  );
};

export default ChatState;
