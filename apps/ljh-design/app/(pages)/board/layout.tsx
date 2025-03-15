import NavBar from '@/app/_components/Board/Navbar';
import SiderBar from '@/app/_components/Board/SiderBar';
import { Providers } from '@/app/_provide/providers';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  // 这里可以进行异步操作，比如获取用户信息等
  return {
    title: '用户面板/ljh-design',
    description: 'ljh-design面板',
    // 可以添加更多元数据
    keywords: ['ljh-design', '用户面板'],
    // 其他元数据配置...
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
