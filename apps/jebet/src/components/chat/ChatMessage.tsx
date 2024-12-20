import { Member, Workspace } from '@/types/workspace';
import { InfiniteData } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import UserMessageButton from '../command/UserMessageButton';
import MessageItem from './MessageItem';
const UserButtonsContainer = styled.div``;
interface ChatMessageProps {
  workspace: Workspace & { member: Member[] };
  userId: string;
  message: InfiniteData<{
    messages: {
      data: {
        id: string;
        created_at: string;
        message: string;
        userId: string;
        workspaceId: string;
      }[];
      count: number | null;
      pageTo: number;
    };
  }>;
}
const MessageContainer = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1rem;
`;
const MessageDescpt = styled.div<{ isSelf: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isSelf ? 'row-reverse' : 'row')};
  gap: 1rem;
`;

const ChatMessage = observer(
  ({ message, workspace, userId }: ChatMessageProps) => {
    return (
      <MessageContainer>
        {message.pages
          .map((item) => item.messages.data)
          .flat()
          .map((messageData) => {
            const sendUser = workspace.member.find(
              (item) => item.userId === messageData.userId
            );
            if (sendUser) {
              return (
                <MessageDescpt isSelf={sendUser.userId === userId}>
                  <UserButtonsContainer>
                    <UserMessageButton user={sendUser} />
                  </UserButtonsContainer>
                  <MessageItem
                    message={messageData}
                    isSelf={sendUser.userId === userId}
                  />
                </MessageDescpt>
              );
            }
          })}
      </MessageContainer>
    );
  }
);

export default ChatMessage;
