import type { Profiles } from '@/types/user';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
const UserBoxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  margin-left: 1rem;
`;
interface UserBoxProps {
  user: Profiles;
}
const UserBox = observer(({ user }: UserBoxProps) => {
  return (
    <UserBoxContainer>
      <Avatar>
        <AvatarImage src={user.image} />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
    </UserBoxContainer>
  );
});

export default UserBox;
