import { useGetMessage } from '@/server/hooks/chat';
import { Member, Workspace } from '@/types/workspace';
import styled from 'styled-components';
import './chatMessage.scss';
import ChatMessage from '../chat/ChatMessage';
import { observer } from 'mobx-react-lite';
import chatStore from '@/store/chat';

interface ChatMessageListProps {
  workspace: Workspace & { member: Member[] };
}
const MessageContainer = styled.div`
  display: flex;
  width: 100%;
`;
const ChatMessageList = observer(({ workspace }: ChatMessageListProps) => {
  const {
    // message,
    // messageHasNextPage,
    // isFetchingNextPage,
    // fetchNextPage,
    // isFetchingPreviousPage,
    // fetchPreviousPage,
    messageLoading,
  } = useGetMessage(
    workspace.id,
    workspace.member[0].userId,
    chatStore.isConnected
  );

  return (
    <MessageContainer>{!messageLoading && <ChatMessage />}</MessageContainer>
  );
});

export default ChatMessageList;
