import type { Member } from '@/types/workspace';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface UserMessageButtonProps {
  user: Member;
}

const UserMessageButton = ({ user }: UserMessageButtonProps) => {
  return (
    <div>
      <Avatar>
        <AvatarImage src={user.userImage} alt="用户头像" />
        <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserMessageButton;
