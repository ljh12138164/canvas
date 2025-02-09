import { ThemeToggle } from '@/app/_components/Comand/ThemeToggle';
import { AdminSidebar } from '@/app/_components/admin/AdminSider';
import { Separator } from '@/app/_components/ui/separator';
import { SidebarTrigger } from '@/app/_components/ui/sidebar';
import { Providers } from '@/app/_provide/providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LJH-DESIGN',
  description: 'LJH-DESIGN',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body>
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
      </body>
    </html>
  );
}
