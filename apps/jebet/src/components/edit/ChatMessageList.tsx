import { useGetMessage } from '@/server/hooks/chat';
import { Member, Workspace } from '@/types/workspace';
import styled from 'styled-components';
import ChatMessage from '../chat/ChatMessage';
import { observer } from 'mobx-react-lite';
import chatStore from '@/store/chat';
import { useMessage } from '@/hooks/useMessage';

interface ChatMessageListProps {
  workspace: Workspace & { member: Member[] };
  userId: string;
}
const ChatMessageContainer = styled.main`
  flex: 1;
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
const ChatMessageList = observer(
  ({ workspace, userId }: ChatMessageListProps) => {
    const {
      messageLoading,
      message,
      messageHasNextPage,
      fetchNextPage,
      isFetchingNextPage,
    } = useGetMessage(
      workspace.id,
      workspace.member[0].userId,
      chatStore.isConnected
    );
    const { topRef, bottomRef, messageRef } = useMessage({
      messageLoading,
      fetchNextPage,
      isFetchingNextPage,
      messageHasNextPage,
    });
    // console.log(message);
    return (
      <ChatMessageContainer ref={messageRef}>
        <MessageContainer>
          <div className='h-10' ref={topRef}>
            {!messageLoading && (
              <>
                {messageHasNextPage ? (
                  <p className='text-sm text-zinc-500 text-center hover:text-zinc-700'>
                    {isFetchingNextPage ? '加载中...' : '加载更多'}
                  </p>
                ) : (
                  <p className='text-sm text-zinc-500'>没有更多了</p>
                )}
              </>
            )}
          </div>
          {/* 消息显示 */}
          {!messageLoading && message?.pages?.length && (
            <ChatMessage
              userId={userId}
              workspace={workspace}
              message={message}
            />
          )}
          {messageLoading && <div>加载中</div>}
          <div className='h-10' ref={bottomRef} />
        </MessageContainer>
      </ChatMessageContainer>
    );
  }
);

export default ChatMessageList;
