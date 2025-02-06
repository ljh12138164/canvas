import NavBar from '@/app/_components/Board/Navbar';
import SiderBar from '@/app/_components/Board/SiderBar';
import { Providers } from '@/app/_provide/providers';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: '面板',
  description: 'LJH Design',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="bg-muted h-[100dvh] ">
            <SiderBar />
            <div className="lg:pl-[300px] flex flex-col h-full">
              <NavBar />
              <main className="px-2 py-4 bg-[#fff] dark:bg-[#121212] flex-1 min-w-[380px] overflow-hidden">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
