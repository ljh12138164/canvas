import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/app/_components/ui/breadcrumb';
import { Separator } from '@/app/_components/ui/separator';
import { SidebarTrigger } from '@/app/_components/ui/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '好友列表/ljh-design',
  description: 'ljh-design好友列表',
  keywords: ['ljh-design', '好友列表', '好友'],
};

export default async function Home() {
  return (
    <main className="entry">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/board/friend/home">主页</BreadcrumbLink>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbLink href="/board/friend/home">好友</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">4</div>
    </main>
  );
}
