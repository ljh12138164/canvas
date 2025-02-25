import { useAddFriend, useFrident } from '@/app/_hook/query/useFrident';
import { useUser } from '@/app/_store/auth';
import type { Profiles } from '@/app/_types/user';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import { toast } from 'react-hot-toast';
import AvatarImage from '../Comand/AvatarImage';
import { Response } from '../Comand/Response';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

export function FirdentItem({
  item,
  userList,
}: { item: Profiles; userList: Map<string, Profiles> }) {
  const addFriendRef = useRef<{
    closeModel: () => void;
  }>(null);
  const { data, isLoading } = useFrident();
  const { addFriendMutate } = useAddFriend();
  const queryClient = useQueryClient();
  const isFriend = useMemo(() => {
    let isFriend = '';
    let isFetch = '';
    data?.forEach((items) => {
      // 如果是我添加的好友
      if (items.userId === item.id) {
        if (items.isInvite) isFriend = '已经是好友';
        else isFetch = '等待你的同意';
      }
      // 如果是我被添加的好友
      if (items.adduser === item.id) {
        if (!items.isInvite) isFetch = '等待对方同意';
        else isFriend = '已经是好友';
      }
    });
    if (isFriend) return isFriend;
    if (isFetch) return isFetch;
    return '添加好友';
  }, [data, item.id]);
  return (
    <div className="space-y-2 flex flex-col justify-between">
      <div className="flex items-center gap-2 p-2">
        <div className="flex items-center gap-2">
          <AvatarImage src={item.image} alt={item.name} priority width={30} height={30} />
          <div className="flex flex-col">
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-xs text-gray-500">{item.email}</p>
          </div>
        </div>
        {!userList.has(item.id) ? (
          <Response
            title="添加好友(需要对方同意)"
            description="添加好友"
            showDescription={false}
            myTrigger={
              <Button
                variant="outline"
                className="ml-auto"
                disabled={isLoading || isFriend !== '添加好友'}
              >
                {isFriend}
              </Button>
            }
            onConfirm={() => {
              toast.loading('发起好友请求中...');
              addFriendMutate(
                { json: { addUserId: item.id } },
                {
                  onSuccess: () => {
                    toast.dismiss();
                    queryClient.invalidateQueries({ queryKey: ['frident'] });
                    addFriendRef.current?.closeModel();
                    toast.success('发起好友请求成功');
                  },
                },
              );
            }}
            ref={addFriendRef}
          >
            <section className="flex flex-col gap-2">
              <p>
                添加好友 <span className="text-sm text-red-500">{item.name}</span>
              </p>
            </section>
          </Response>
        ) : (
          <div className="ml-auto">已经是好友了</div>
        )}
      </div>
      <Separator />
    </div>
  );
}
