import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@/app/_components/ui/sidebar';
import { useSearchFriend } from '@/app/_hook/query/useFrident';
import { debounce } from 'lodash-es';
import { Search } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Response } from '../Comand/Response';

const FridenNav = ({
  search,
  handleSearch,
}: {
  search: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const addFriendRef = useRef<{ closeModel: () => void } | null>(null);
  const manageFriendRef = useRef<{ closeModel: () => void } | null>(null);

  const [addFriend, setAddFriend] = useState('');
  const {
    data: searchFriendData,
    isLoading: searchFriendLoading,
    error: searchFriendError,
  } = useSearchFriend(addFriend);

  // 添加好友
  const addFriendFn = () => {};

  // 关闭弹窗
  const closeModel = () => {
    addFriendRef.current?.closeModel();
    manageFriendRef.current?.closeModel();
  };
  const handleAddFriend = useMemo(
    () =>
      debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setAddFriend(e.target.value);
      }, 1000),
    [],
  );

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="flex  gap-1 flex-col w-full p-2">
        <Response
          title="添加好友"
          showFooter={false}
          description="添加好友"
          myTrigger={
            <Button variant="ghost" className="w-full bg-primary/5">
              添加好友
            </Button>
          }
          ref={addFriendRef}
        >
          <section className="h-96">
            <Input placeholder="请输入好友名称" onChange={handleAddFriend} />
            {searchFriendLoading && <div>加载中...</div>}
            {searchFriendError && <div>加载失败</div>}
            {searchFriendData?.map((item) => (
              <div key={item.id}>{item.name}</div>
            ))}
          </section>
        </Response>
        <Response
          title="管理好友"
          description="管理好友"
          showFooter={false}
          myTrigger={
            <Button variant="ghost" className="w-full bg-primary/5">
              管理好友
            </Button>
          }
          ref={manageFriendRef}
        >
          <section className="h-96">{/* TODO: */}</section>
        </Response>
      </div>
      <form>
        <SidebarGroup className="py-0">
          <SidebarGroupContent className="relative">
            <Label htmlFor="search" className="sr-only">
              搜索
            </Label>
            <SidebarInput
              id="search"
              placeholder="搜索用户"
              className="pl-8"
              value={search}
              onChange={handleSearch}
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
          </SidebarGroupContent>
        </SidebarGroup>
      </form>
    </div>
  );
};

export default FridenNav;
