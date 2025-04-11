import { cn } from '@/app/_lib/utils';
import { useUser } from '@/app/_store/auth';
import type { ChatMessage } from '@/app/_types/chat';
import type { Profiles } from '@/app/_types/user';
import { format } from 'date-fns';
import { useMemo } from 'react';
import AvatarImage from '../Comand/AvatarImage';

const ChatItem = ({ item, other }: { item: ChatMessage; other: Profiles }) => {
  const { user } = useUser();
  const isSelf = useMemo(() => user?.user.id === item.sendId, [user?.user?.id, item.sendId]);

  return (
    <>
      <div className={cn('flex items-start gap-2 p-2', isSelf ? 'flex-row-reverse' : 'flex-row')}>
        <AvatarImage
          userInfo={isSelf ? user?.user.user_metadata! : other}
          src={isSelf ? user?.user.user_metadata.image || '' : other.image}
          alt={isSelf ? user?.user.user_metadata.name || '' : other.name}
          width={40}
          height={40}
          priority={true}
          className="rounded-full"
        />
        <div className={cn('flex flex-col max-w-[70%]', isSelf ? 'items-end' : 'items-start')}>
          <div
            className={cn(
              'p-3 rounded-lg',
              isSelf ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black',
            )}
          >
            {item.message}
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {item.created_at ? format(new Date(item.created_at), 'HH:mm') : ''}
          </span>
        </div>
      </div>
    </>
  );
};

export default ChatItem;
