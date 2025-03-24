import type * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/app/_components/ui/sidebar';
import { useFrident } from '@/app/_hook/query/useFrident';
import { cn } from '@/app/_lib/utils';
import { useUser } from '@/app/_store/auth';
import type { Profiles } from '@/app/_types/user';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import AvatarImage from '../Comand/AvatarImage';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipProvider } from '../ui/tooltip';
import FridenNav from './FridentNav';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const { user } = useUser();
  const { data: users, isLoading } = useFrident();
  const userData = useMemo(() => {
    if (!user || !users || isLoading) return [];
    const set = new Map<string, Profiles>();
    users
      .filter((item) => item.isInvite)
      .forEach((item) => {
        if (item.user_profile.id !== user.user.id) set.set(item.id, item.user_profile);
        if (item.friend_profile.id !== user.user.id) set.set(item.id, item.friend_profile);
      });
    return set;
  }, [user, users, isLoading]);
  return (
    <Sidebar {...props}>
      {/* 头部 */}
      <SidebarHeader>
        <FridenNav />
      </SidebarHeader>
      {/* 内容 */}
      <SidebarContent>
        <nav className="p-1">
          <Input placeholder="搜索" value={search} onChange={(e) => setSearch(e.target.value)} />
        </nav>
        {Array.from(userData.values())
          .filter((item) => item.name.includes(search))
          .map((item) => (
            <SidebarGroup key={item.name}>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem
                    key={item.name}
                    onClick={() => {
                      router.push(`/board/friend/${item.id}`);
                    }}
                    className={cn(
                      'p-0 flex items-center transition-all duration-300 justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800',
                      pathname === `/board/friend/${item.id}` &&
                        'border-l-4 border-indigo-500 animate-border-l',
                    )}
                  >
                    <Tooltip>
                      <TooltipProvider>
                        {
                          <AvatarImage
                            userInfo={item}
                            priority
                            className={cn('aspect-square')}
                            src={item.image}
                            alt={item.name}
                            width={35}
                            height={35}
                          />
                        }
                        <TooltipContent>{item.name}</TooltipContent>
                      </TooltipProvider>
                    </Tooltip>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
