import type { Metadata } from 'next';
import 'react-photo-view/dist/react-photo-view.css';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
