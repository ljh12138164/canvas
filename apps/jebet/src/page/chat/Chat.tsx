import ChatMeta from '@/components/chat/ChatMeta';
import Tiptap from '@/components/edit';
import ChatMessageList from '@/components/edit/ChatMessageList';
import chatStore from '@/store/chat';
import useStore from '@/store/user';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
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
  display: grid;
  grid-template-columns: 1fr 30px;
`;

const Chat = observer(() => {
  const store = useStore;
  const params = useParams();
  useEffect(() => {
    if (store.userData === null || store.workspace === null) return;
    const activeWorkSpace = store.workspace.find(
      (item) => item.id === params.workspaceId
    );
    if (!activeWorkSpace) return;
    if (chatStore.socket) return;
    const socket = io('http://localhost:8088');
    socket.on('connect', () => {
      // 连接成功
      socket.emit('connectChat', {
        userId: store.userData?.id,
        username: store.userData?.username,
        avatar: store.userData?.imageUrl,
        workspaceId: activeWorkSpace.id,
      });
      chatStore.socket = socket;
    });
    socket.on('leaveChat', (data) => {
      console.log('有人离开聊天', data);
      chatStore.setActiveUser(
        chatStore.activeUser.filter((item) => item?.socketId !== data.socketId)
      );
      chatStore.setConnectCount(data.roomSize);
      // 断开连接
    });
    socket.on(`joinChat`, (data) => {
      console.log('有人加入聊天', data);
      if (!chatStore.activeUser.some((item) => item.userId === data.userId))
        chatStore.setActiveUser([
          data,
          {
            avatar: store.userData?.imageUrl,
            username: store.userData?.username,
            userId: store.userData?.id,
          },
        ]);
      else chatStore.setActiveUser([data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [store.userData, store.workspace, params.workspaceId]);

  // 如果用户未登录，则返回
  if (store.userData === null || store.workspace === null) return <></>;
  const activeWorkSpace = store.workspace.find(
    (item) => item.id === params.workspaceId
  );
  if (!store.userData) {
    toast.error('请先登录');
    return <Navigate to='/sign-in' replace />;
  }
  if (!activeWorkSpace) {
    toast.error('未找到工作区');
    return <Navigate to='/dashboard' replace />;
  }
  if (!params.workspaceId) {
    toast.error('未选择工作区');
    return <Navigate to='/dashboard' replace />;
  }
  return (
    <ChatContainer>
      <Content>
        <ChatHeaderContainer>
          <ChatMeta></ChatMeta>
        </ChatHeaderContainer>
        <ChatMessage>
          <ChatMessageList></ChatMessageList>
        </ChatMessage>
        <EditContainer>
          <Tiptap workspace={activeWorkSpace} />
        </EditContainer>
      </Content>
    </ChatContainer>
  );
});
export default Chat;
