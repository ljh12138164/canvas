import { Member, Workspace } from '@/types/workspace';
import { InfiniteData } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import UserMessageButton from '../command/UserMessageButton';
import MessageItem from './MessageItem';
import { MessageType } from '@/types/chat';
import { PhotoProvider, PhotoView } from 'react-photo-view';

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
        type: MessageType;
      }[];
      count: number | null;
      pageTo: number;
    };
  }>;
}
const ImageContainer = styled.img`
  width: 5rem;
  height: 5rem;
  object-fit: cover;
`;
const MessageContainer = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
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
                  {messageData.type === MessageType.TEXT && (
                    <MessageItem message={messageData} />
                  )}
                  {messageData.type === MessageType.IMAGE && (
                    <PhotoProvider>
                      <PhotoView src={messageData.message} key={messageData.message}>
                        {/* <a
                          href={messageData.message}
                          target='_blank'
                          className='flex items-center justify-center'
                        > */}
                        <ImageContainer src={messageData.message} alt='上传图片'/>
                        {/* </a> */}
                      </PhotoView>
                    </PhotoProvider>
                  )}
                </MessageDescpt>
              );
            }
          })}
      </MessageContainer>
    );
  }
);

export default ChatMessage;
