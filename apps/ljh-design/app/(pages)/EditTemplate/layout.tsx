import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: '模板编辑器/ljh-design',
  description: 'ljh-design模板编辑器',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
