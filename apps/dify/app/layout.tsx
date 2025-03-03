import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';

import './globals.css';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });
// ${geistSans.variable} ${geistMono.variable}
export const metadata: Metadata = {
  title: 'React 代码回显',
  description: '在线编辑和预览 React 组件',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="zh-CN" suppressHydrationWarning>
        <header>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
        </header>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
