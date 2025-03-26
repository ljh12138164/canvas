'use client';
import { Bookmark, FileText, Heart, LayoutDashboard, MessageSquare, Users } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/app/_components/ui/sidebar';
import { usePathname } from 'next/navigation';
import SiderBarItem from '../Board/SiderBarItem';
import { Separator } from '../ui/separator';
// Menu items.

/**
 * ### 菜单项
 * @returns 菜单项
 */
const menuItems = [
  {
    title: '仪表盘',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    title: '用户统计',
    icon: Users,
    href: '/admin/users',
  },
  {
    title: '话题统计',
    icon: FileText,
    href: '/admin/show',
  },
  {
    title: 'AI统计',
    icon: MessageSquare,
    href: '/admin/ai',
  },
  {
    title: '画布统计',
    icon: LayoutDashboard,
    href: '/admin/board',
  },
  {
    title: '素材统计',
    icon: FileText,
    href: '/admin/material',
  },
  {
    title: '点赞统计',
    icon: Heart,
    href: '/admin/upvotes',
  },
  {
    title: '收藏统计',
    icon: Bookmark,
    href: '/admin/collections',
  },
];

/**
 * ### 管理员侧边栏
 * @param param0 参数
 * @returns 管理员侧边栏
 */
export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-2xl font-bold px-4 py-2">
                ljh-design
              </SidebarGroupLabel>
              <Separator className="my-2" />
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col gap-2 px-2">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <SiderBarItem
                          href={item.href}
                          label={item.title}
                          Icon={item.icon}
                          isActive={pathname === item.href}
                        />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        {children}
      </SidebarProvider>
    </>
  );
}
