import { Member } from '@/types/workspace';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';

interface UserMessageButtonProps {
  user: Member;
}

const UserMessageButton = ({ user }: UserMessageButtonProps) => {
  return (
    <div>
      <Avatar>
        <AvatarImage src={user.userImage} />
        <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserMessageButton;
