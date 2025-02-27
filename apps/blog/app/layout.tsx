import type { Metadata } from 'next';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import 'nextra-theme-docs/style.css';
import { Head } from 'nextra/components';
import { GitHubIcon } from 'nextra/icons';
import { getPageMap } from 'nextra/page-map';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
  title: 'ljh的技术博客',
  description:
    'ljh的技术博客,里面记录了我的- 💻 编程技术心得🔧 实用工具推荐📚 学习资源整理 🎨 项目开发经验',
  keywords: [
    'ljh',
    'github',
    'ljh的技术博客',
    '编程技术心得',
    '实用工具推荐',
    '学习资源整理',
    '项目开发经验',
    'ljh12138164',
  ],
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};
// 设置视口
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 10,
  minimumScale: 1,
};
const navbar = (
  <Navbar
    projectIcon={
      <GitHubIcon aria-label="点击查看项目地址" style={{ width: '1.5rem', height: '1.5rem' }} />
    }
    projectLink="https://github.com/ljh12138164"
    logo={<b>ljh的技术博客</b>}
    // ... Your additional navbar options
  />
);
const footer = <Footer>MIT {new Date().getFullYear()} © ljh-blog.</Footer>;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap();
  return (
    <html
      // Not required, but good for SEO
      lang="zh-CN"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          feedback={{
            content: null,
            labels: undefined,
          }}
          editLink={null}
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/ljh12138164"
          footer={footer}
          navigation={{
            next: false,
            prev: false,
          }}
          // ... Your additional layout options
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
