import type { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';
import 'react-day-picker/style.css';
import 'react-photo-view/dist/react-photo-view.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'LJH-DESIGN 设计工具',
  description: 'LJH-DESIGN 设计工具',
  keywords: 'LJH-DESIGN 设计工具',
};
const myFont = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={myFont.className}>
      <head>
        <link rel="preconnect" href="https://www.ljhboard.cn" />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/i18n/zh.json"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
