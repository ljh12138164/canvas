import { useMessage } from '@/hooks/useMessage';
import { useGetMessage } from '@/server/hooks/chat';
import chatStore from '@/store/chat';
import type { Member, Workspace } from '@/types/workspace';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import ChatMessage from '../chat/ChatMessage';

interface ChatMessageListProps {
  workspace: Workspace & { member: Member[] };
  userId: string;
}
const ChatMessageContainer = styled.main`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  height: calc(100% - 250px);
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 2px;
`;

const ChatMessageList = observer(({ workspace, userId }: ChatMessageListProps) => {
  const { messageLoading, message, messageHasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetMessage(workspace.id, workspace.member[0].userId, chatStore.isConnected);
  const { topRef, bottomRef, messageRef } = useMessage({
    messageLoading,
    fetchNextPage,
    isFetchingNextPage,
    messageHasNextPage,
  });
  return (
    <ChatMessageContainer ref={messageRef}>
      <MessageContainer>
        {!messageLoading && (
          <section>
            {messageHasNextPage ? (
              <p className="text-sm text-zinc-500 text-center mb-4">
                {isFetchingNextPage ? '加载中...' : '加载更多'}
              </p>
            ) : (
              <p className="text-sm h-full text-zinc-500 flex mb-4  flex-col items-center justify-center" />
            )}
          </section>
        )}
        <div className="h-5" ref={topRef} />
        {/* 消息显示 */}
        {!messageLoading && message?.pages?.length && (
          <ChatMessage userId={userId} workspace={workspace} message={message} />
        )}
        {messageLoading && <div>加载中</div>}
        <div className="h-10" ref={bottomRef} />
      </MessageContainer>
    </ChatMessageContainer>
  );
});

export default ChatMessageList;
