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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
