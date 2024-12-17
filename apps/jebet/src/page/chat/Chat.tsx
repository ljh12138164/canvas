import Tiptap from '@/components/edit';
import ChatMessageList from '@/components/edit/ChatMessageList';
import useStore from '@/store/user';
import { observer } from 'mobx-react-lite';
import toast from 'react-hot-toast';
import { Navigate, useParams } from 'react-router-dom';
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
const Header = styled.div`
  flex: 1;
  height: 50px;
`;
const Chat = observer(() => {
  const store = useStore;
  const params = useParams();
  // useEffect(() => {
  //   const socket = io('http://localhost:8088');
  //   socket.on('connect', () => {
  //     console.log('连接成功');
  //   });
  //   socket.on('message', (message) => {
  //     console.log(message);
  //   });
  // }, []);
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
          <Header>{}</Header>
          <Header>在线人数</Header>
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
