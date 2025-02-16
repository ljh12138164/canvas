import type { ActiveUser } from '@/types/chat';
import styled from 'styled-components';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface UserButtonsProps {
  user: ActiveUser;
}
const UserAvatarContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
const Description = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const UserButtons = ({ user }: UserButtonsProps) => {
  return (
    <UserAvatarContainer>
      <Avatar>
        <AvatarImage src={user?.avatar} alt="用户头像" />
        <AvatarFallback>{user?.username}</AvatarFallback>
      </Avatar>
      <Description>
        <p>用户:{user?.username}</p>
        <div>加入工作区聊天室</div>
      </Description>
    </UserAvatarContainer>
  );
};

export default UserButtons;
