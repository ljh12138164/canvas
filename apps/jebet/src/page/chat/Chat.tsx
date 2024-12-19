import ChatMeta from '@/components/chat/ChatMeta';
import Tiptap from '@/components/edit';
import ChatMessageList from '@/components/edit/ChatMessageList';
import { useToast } from '@/hooks/use-toast';
import chatStore from '@/store/chat';
import useStore from '@/store/user';
import { ActiveUser, Message } from '@/types/chat';
import { useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import styled from 'styled-components';

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
const ChatMessage = styled.div`
  flex: 1;
  height: calc(100% - 250px);
`;
const EditContainer = styled.div`
  flex: 1;
  height: 150px;
`;
const ChatHeaderContainer = styled.div`
  flex: 1;
  height: 50px;
`;
// @ts-ignore
const Chat = observer(() => {
  const queryClient = useQueryClient();
  const store = useStore;
  const params = useParams();
  const { toast } = useToast();
  useEffect(() => {
    if (store.userData === null || store.workspace === null) return;
    const activeWorkSpace = store.workspace.find(
      (item) => item.id === params.workspaceId
    );
    if (!activeWorkSpace) return;
    if (chatStore.socket) return;
    const socket = io('http://localhost:8088', {
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
      chatStore.socket = socket;
      //初始化
      socket.on(`initChat`, (data: ActiveUser) => {
        console.log(data);
        chatStore.setConnectCount(data.roomSize);
      });

      // 断开连接
      socket.on(`leaveChat`, (data: ActiveUser) => {
        chatStore.setConnectCount(data.roomSize);
      });
      // 有人加入聊天
      socket.on(`joinChat`, (data: ActiveUser) => {
        toast({
          title: `${data.username}加入聊天`,
          description: '请稍后再试',
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
    });
    socket.on('disconnect', () => {
      chatStore.setIsConnected(false);
    });
    socket.on('sendMessage', (data) => {
      const oldData = queryClient.getQueryData([activeWorkSpace.id]) as {
        pageParams: number[];
        pages: {
          messages: { data: Message[]; count: number; page: number };
        }[];
      };
      queryClient.setQueryData([activeWorkSpace.id], {
        pageParams: oldData.pageParams,
        pages: [
          {
            messages: {
              data: [
                {
                  content: data.message,
                  timestamp: new Date().getTime(),
                  userId: data.userId,
                  workspaceId: data.workspaceId,
                  id: nanoid(),
                },
                ...oldData.pages[0].messages.data,
              ],
              count: oldData.pages[0].messages.count + 1,
              page: oldData.pages[0].messages.page + 1,
            },
          },
        ],
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [store.userData, store.workspace, params.workspaceId, toast, queryClient]);
  // 如果用户未登录，则返回
  if (store.userData === null || store.workspace === null) return <></>;
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
            isConnected={chatStore.isConnected}
            workspace={activeWorkSpace}
          />
        </ChatHeaderContainer>
        <ChatMessage>
          <ChatMessageList workspace={activeWorkSpace}></ChatMessageList>
        </ChatMessage>
        <EditContainer>
          <Tiptap workspace={activeWorkSpace} userId={store.userData.id} />
        </EditContainer>
      </Content>
    </ChatContainer>
  );
});
export default Chat;
