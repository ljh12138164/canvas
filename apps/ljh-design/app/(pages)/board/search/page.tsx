import { Providers } from '@/app/_provide/providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '搜索/ljh-design',
  description: 'ljh-design搜索',
  keywords: ['ljh-design', '搜索', '搜索结果'],
};

export default async function Home() {
  return (
    <div className="h-[100dvh] overflow-hidden entry">
      <Providers>
        <div>222</div>
      </Providers>
    </div>
  );
}
