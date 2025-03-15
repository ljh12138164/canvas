import { ThemeToggle } from '@/app/_components/Comand/ThemeToggle';
import { AdminSidebar } from '@/app/_components/admin/AdminSider';
import { Separator } from '@/app/_components/ui/separator';
import { SidebarTrigger } from '@/app/_components/ui/sidebar';
import { Providers } from '@/app/_provide/providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LJH-DESIGN管理员/ljh-design',
  description: 'LJH-DESIGN管理员',
  keywords: ['ljh-design', '管理员', '管理员面板'],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <AdminSidebar>
        <main className="w-full h-full">
          <header className="h-10 w-full flex justify-between items-center px-6 py-4">
            <SidebarTrigger className="w-12 h-10" />
            <ThemeToggle />
          </header>
          <Separator />
          {children}
        </main>
      </AdminSidebar>
    </Providers>
  );
}
