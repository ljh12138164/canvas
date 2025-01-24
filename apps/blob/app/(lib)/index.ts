import type { MainNavItem, SidebarNavItem } from '@/app/(types)';

export interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  // 顶部导航
  mainNav: [
    {
      title: '首页',
      href: '/',
    },
    {
      title: '文档',
      href: '/docs',
    },
  ],
  // 文档
  sidebarNav: [
    {
      title: '博客',
      items: [
        {
          title: 'Introduction',
          href: '/docs',
          items: [],
        },
        {
          title: 'Installation',
          href: '/docs/installation',
          items: [],
        },
        {
          title: 'components.json',
          href: '/docs/components-json',
          items: [],
        },
        {
          title: 'Theming',
          href: '/docs/theming',
          items: [],
        },
        {
          title: 'Dark mode',
          href: '/docs/dark-mode',
          items: [],
        },
        {
          title: 'CLI',
          href: '/docs/cli',
          items: [],
        },
        {
          title: 'Monorepo',
          href: '/docs/monorepo',
          items: [],
          label: 'New',
        },
        {
          title: 'Next.js 15 + React 19',
          href: '/docs/react-19',
          items: [],
        },
        {
          title: 'Typography',
          href: '/docs/components/typography',
          items: [],
        },
        {
          title: 'Open in v0',
          href: '/docs/v0',
          items: [],
        },
        {
          title: 'Figma',
          href: '/docs/figma',
          items: [],
        },
        {
          title: 'Changelog',
          href: '/docs/changelog',
          items: [],
        },
      ],
    },
  ],
};
