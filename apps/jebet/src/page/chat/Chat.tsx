import ChatMeta from '@/components/chat/ChatMeta';
import UserButtons from '@/components/command/UserButtons';
import Tiptap from '@/components/edit';
import ChatMessageList from '@/components/edit/ChatMessageList';
import { useToast } from '@/hooks/use-toast';
import chatStore from '@/store/chat';
import useStore from '@/store/user';
import { ActiveUser, ChatMessage as Message, MessageType } from '@/types/chat';
import { useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import { Skeleton } from '@/components/ui/skeleton';

const ChatContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100dvh - 100px);
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  // background-color: #f0f0f0;
  height: 100%;
`;

const EditContainer = styled.div`
  flex: 1;
  height: 150px;
`;
const ChatHeaderContainer = styled.div`
  flex: 1;
  height: 50px;
`;

const SkeletonContainer = styled.div`
  width: 100%;
  height: calc(100dvh - 100px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const ChatHeaderSkeleton = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MessageSkeleton = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

// @ts-ignore
const Chat = observer(() => {
  const queryClient = useQueryClient();
  const store = useStore;
  const params = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    if (store.userData === null || store.workspace === null) return;
    const activeWorkSpace = store.workspace.find(
      (item) => item.id === params.workspaceId
    );
    if (!activeWorkSpace) return;
    if (chatStore.socket) return;
    const socket = io('http://localhost:8088/api/chat', {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 5000,
      transports: ['websocket'],
    });
    // 连接成功
    socket.on('connect', () => {
      chatStore.setIsConnected(true);
      socket.emit('connectChat', {
        userId: store.userData?.id,
        username: store.userData?.username,
        avatar: store.userData?.imageUrl,
        workspaceId: activeWorkSpace.id,
      });
      console.log('sadfasdfasfsdfasdfsafd');
      setSocket(socket);
      //初始化
      socket.on(`${activeWorkSpace.id}:initChat`, (data: ActiveUser) => {
        chatStore.setConnectCount(data.roomSize);
      });

      // 断开连接
      socket.on(`leaveChat`, (data: ActiveUser) => {
        chatStore.setConnectCount(data.roomSize);
      });
      // 有人加入聊天
      socket.on(`joinChat`, (data: ActiveUser) => {
        chatStore.setConnectCount(data.roomSize);
        toast({
          description: <UserButtons user={data}></UserButtons>,
          variant: 'default',
        });
      });

      socket.on('connect_error', () => {
        toast({
          title: '聊天服务连接失败',
          description: '请稍后再试',
          variant: 'destructive',
        });
      });

      socket.on('reconnect', () => {
        toast({
          title: '重新连接成功',
          description: '请稍后再试',
          variant: 'default',
        });
      });
      socket.on(
        'sendMessage',
        (data: {
          id: string;
          workspaceId: string;
          message: string;
          userId: string;
          created_at: string;
          type: MessageType;
        }) => {
          const oldData = queryClient.getQueryData([activeWorkSpace.id]) as {
            pageParams: number[];
            pages: {
              messages: {
                data: Message[];
                count: number;
                page: number;
              };
            }[];
          };
          queryClient.setQueryData([activeWorkSpace.id], {
            pageParams: oldData.pageParams,
            pages: [
              {
                messages: {
                  data: [
                    {
                      message: data.message,
                      created_at: data.created_at,
                      userId: data.userId,
                      workspaceId: data.workspaceId,
                      id: data.id,
                      type: data.type,
                    },
                    ...oldData.pages[0].messages.data,
                  ],
                  count: oldData.pages[0].messages.count + 1,
                  page: oldData.pages[0].messages.page + 1,
                },
                ...oldData.pages.slice(1),
              },
            ],
          });
        }
      );
    });
    socket.on('disconnect', () => {
      chatStore.setIsConnected(false);
    });
  }, [store.userData, store.workspace, params.workspaceId, toast, queryClient]);
  // 如果用户未登录，显示骨架屏
  if (store.userData === null || store.workspace === null) {
    return (
      <SkeletonContainer>
        <ChatHeaderSkeleton>
          <Skeleton className='h-8 w-8 rounded-full' />
          <Skeleton className='h-6 w-[200px]' />
        </ChatHeaderSkeleton>

        <div className='flex-1'>
          {[1, 2, 3].map((i) => (
            <MessageSkeleton key={i}>
              <Skeleton className='h-8 w-8 rounded-full' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-[250px]' />
                <Skeleton className='h-4 w-[400px]' />
              </div>
            </MessageSkeleton>
          ))}
        </div>

        <Skeleton className='h-[150px] w-full rounded-md' />
      </SkeletonContainer>
    );
  }
  const activeWorkSpace = store.workspace.find(
    (item) => item.id === params.workspaceId
  );
  if (!store.userData) {
    toast({
      title: '请先登录',
      description: '请稍后再试',
      variant: 'destructive',
    });
    return <Navigate to='/sign-in' replace />;
  }
  if (!activeWorkSpace) {
    toast({
      title: '未找到工作区',
      description: '请稍后再试',
      variant: 'destructive',
    });
    return <Navigate to='/dashboard' replace />;
  }
  if (!params.workspaceId) {
    toast({
      title: '未选择工作区',
      description: '请稍后再试',
      variant: 'destructive',
    });
    return <Navigate to='/dashboard' replace />;
  }
  return (
    <ChatContainer>
      <Content>
        <ChatHeaderContainer>
          <ChatMeta
            socket={socket}
            isConnected={chatStore.isConnected}
            workspace={activeWorkSpace}
          />
        </ChatHeaderContainer>
        <ChatMessageList
          workspace={activeWorkSpace}
          userId={store.userData.id}
        />
        <EditContainer>
          <Tiptap workspace={activeWorkSpace} userId={store.userData.id} />
        </EditContainer>
      </Content>
    </ChatContainer>
  );
});
export default Chat;
