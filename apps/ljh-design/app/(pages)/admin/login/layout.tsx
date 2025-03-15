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
  return <Providers>{children}</Providers>;
}
