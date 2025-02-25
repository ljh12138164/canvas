'use client';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { useFrident, useSearchFriend } from '@/app/_hook/query/useFrident';
import { useUser } from '@/app/_store/auth';
import type { Profiles } from '@/app/_types/user';
import { debounce } from 'lodash-es';
import { UserPlus } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import ColorCard from '../Comand/ColorCard';
import { Response } from '../Comand/Response';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import FirdentAplly from './FirdentAplly';
import { FirdentItem } from './FirdentItem';
import { FriendTable } from './FridendTable';
import { columns } from './FridendTableColume';
// 模拟好友数据

const FridentHome = () => {
  const [addFriend, setAddFriend] = useState('');
  const { user } = useUser();
  const addFriendRef = useRef<{ closeModel: () => void } | null>(null);
  const manageFriendRef = useRef<{ closeModel: () => void } | null>(null);

  const friendApplyRef = useRef<{ closeModel: () => void } | null>(null);
  // 搜索好友
  const {
    data: searchFriendData,
    isLoading: searchFriendLoading,
    error: searchFriendError,
  } = useSearchFriend(addFriend);

  const handleAddFriend = useMemo(
    () =>
      debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setAddFriend(e.target.value);
      }, 1000),
    [],
  );

  // 获取好友列表
  const { data: users, isLoading } = useFrident();

  const userList = useMemo(() => {
    if (!users || isLoading) return new Map<string, Profiles>();
    const map = new Map<string, Profiles>();
    const userId = user?.user.id;
    // 添加好友
    users.forEach((item) => {
      if (!item.isInvite) return;
      if (item.friend_profile.id !== userId) {
        map.set(item.friend_profile.id, item.friend_profile);
      }
      if (item.user_profile.id !== userId) {
        map.set(item.user_profile.id, item.user_profile);
      }
    });

    return map;
  }, [users]);
  // 好友申请列表
  const friendApplyList = useMemo(() => {
    const map = new Map<string, Profiles>();
    users
      ?.filter((item) => !item.isInvite)
      ?.forEach((items) => {
        // 如果是我被添加的好友
        if (items.adduser === user?.user.id) {
          map.set(items.user_profile.id, items.user_profile);
        }
      });
    return Array.from(map.values());
  }, [users, user]);

  return (
    <div>
      <main>
        <SidebarTrigger />
        <Separator className="my-2" />
        <ColorCard
          title="添加好友,可以和好友分享画布"
          icon={<UserPlus className="text-blue-500 text-[2rem] animate-pulse hover:animate-spin" />}
          className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-400 border-none shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Response
            title="添加好友"
            showFooter={false}
            description="添加好友"
            myTrigger={<Button variant="outline">添加好友</Button>}
            ref={addFriendRef}
          >
            <section className="h-[calc(100vh-20rem)] p-2">
              <Input placeholder="请输入好友名称" className="mb-2" onChange={handleAddFriend} />
              {searchFriendLoading && <div>加载中...</div>}
              {searchFriendError && <div>加载失败</div>}
              {searchFriendData?.map((item) => (
                <FirdentItem userList={userList} key={item.id} item={item} />
              ))}
            </section>
          </Response>
        </ColorCard>

        {/* 好友申请 */}
        <div className="flex items-center justify-between p-2">
          <h1 className="text-lg font-bold">好友列表</h1>
          <Response
            title="好友申请"
            description="好友申请"
            showDescription={false}
            showFooter={false}
            myTrigger={<Button variant="outline">查看所有</Button>}
            ref={friendApplyRef}
          >
            <section className="h-[calc(100vh-20rem)] p-2">
              {friendApplyList.map((item) => (
                <FirdentAplly key={item.id} item={item} />
              ))}
            </section>
          </Response>
        </div>
        <ScrollArea className="h-[calc(100vh-25rem)] p-4">
          <FriendTable data={Array.from(userList.values())} columns={columns} />
        </ScrollArea>
      </main>
    </div>
  );
};

export default FridentHome;
