import styled from 'styled-components';
import Edit from '@/components/edit';
import useStore from '@/store/user';
import { Navigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { observe } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

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
  height: calc(100% - 200px);
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
const Header = styled.div`Access to XMLHttpRequest at 'http://localhost:8088/socket.io/?EIO=4&transport=polling&t=8hr94dvt' from origin 'http://localhost:8100' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
  flex: 1;
  height: 50px;
`;
const Chat = observer(() => {
  const store = useStore;
  const params = useParams();
  useEffect(() => {
    const socket = io('http://localhost:8088');
    socket.on('connect', () => {
      console.log('连接成功');
    });
    socket.on('message', (message) => {
      console.log(message);
    });
  }, []);

  if (store.userData === null || store.activeProject === null) return null;
  if (!store.userData) {
    toast.error('请先登录');
    return <Navigate to='/sign-in' replace />;
  }
  if (!store.activeProject) {
    toast.error('未选择项目');
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
          <Header>{}</Header>
          <Header>在线人数</Header>
        </ChatHeaderContainer>
        <ChatMessage></ChatMessage>
        <EditContainer>
          <Edit />
        </EditContainer>
      </Content>
    </ChatContainer>
  );
});
export default Chat;
