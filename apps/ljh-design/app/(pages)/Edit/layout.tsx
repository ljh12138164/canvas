import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: '画布编辑器/ljh-design',
  description: 'ljh-design画布编辑器',
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
