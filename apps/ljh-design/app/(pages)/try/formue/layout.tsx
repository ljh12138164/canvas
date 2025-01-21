import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: '展示',
  description: 'LJH Design 展示',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
