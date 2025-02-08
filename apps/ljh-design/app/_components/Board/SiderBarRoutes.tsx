'use client';
import { Separator } from '@/app/_components/ui/separator';
import { AtomIcon, Database, Home, Image, LayoutTemplate, MessageSquare, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import SiderBarItem from './SiderBarItem';
const SiderBarRoutes = ({
  closeRef,
}: {
  closeRef?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const pathname = usePathname();
  return (
    <section className="flex flex-col gap-y-4 flex-1 h-full">
      <div className="px-4">
        <Separator />
      </div>
      <ul className="flex flex-col h-full">
        <li className="flex-1 p-4 flex flex-col gap-6">
          <SiderBarItem
            href="/board"
            label="主页"
            Icon={Home}
            isActive={pathname === '/board'}
            closeRef={closeRef}
          />
          <SiderBarItem
            href="/board/template"
            label="模板中心"
            Icon={LayoutTemplate}
            isActive={pathname.split('/').includes('template')}
            closeRef={closeRef}
          />
          <SiderBarItem
            href="/board/material"
            label="素材中心"
            Icon={Image}
            isActive={pathname.split('/').includes('material')}
            closeRef={closeRef}
          />
          <SiderBarItem
            href="/board/formue"
            label="论坛中心"
            Icon={MessageSquare}
            isActive={pathname.split('/').includes('formue')}
            closeRef={closeRef}
          />
          <SiderBarItem
            href="/board/ai"
            label="Ai助手"
            Icon={AtomIcon}
            isActive={pathname.split('/').includes('ai')}
            closeRef={closeRef}
          />
        </li>
        <Separator />
        <li className="p-4 flex flex-col gap-4">
          <SiderBarItem
            href="/board/userData"
            label="数据统计"
            Icon={Database}
            isActive={pathname.split('/').includes('userData')}
          />
          <SiderBarItem
            href="/board/user"
            label="用户中心"
            Icon={User}
            isActive={pathname.split('/').includes('user')}
          />
        </li>
      </ul>
    </section>
  );
};

export default SiderBarRoutes;
