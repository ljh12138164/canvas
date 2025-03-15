import { Providers } from '@/app/_provide/providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '管理员登录/ljh-design',
  description: 'ljh-design管理员登录',
  keywords: ['ljh-design', '管理员登录', '管理员面板'],
  // 禁止搜索引擎收录
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
  return <Providers>{children}</Providers>;
}
