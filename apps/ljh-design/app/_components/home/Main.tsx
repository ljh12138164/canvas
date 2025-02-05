'use client';
import { Button } from '@/app/_components/ui/button';
import useUsers from '@/app/_hook/useUser';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Main = () => {
  const router = useRouter();
  const { user, loading } = useUsers({ redirects: false });
  return (
    <main className="container mx-auto px-4 pt-24">
      {/* Hero部分 */}
      <div className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          释放创意，<span className="text-primary">设计未来</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">简单易用的在线设计工具，让创意更轻松地实现</p>
        <div className="space-x-4">
          <Button
            size="lg"
            disabled={loading}
            onClick={() => (user ? router.push('/board') : router.push('/sign-in'))}
          >
            前往工作区
          </Button>
          <Link href="/forum">
            <Button variant="outline" size="lg">
              浏览作品
            </Button>
          </Link>
        </div>
      </div>
      {/* 特性展示 */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-xl font-bold mb-3">简单易用</h3>
          <p className="text-gray-600">直观的界面设计，零门槛上手使用</p>
        </div>
        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-xl font-bold mb-3">在线协作</h3>
          <p className="text-gray-600">实时多人协作，提高团队工作效率</p>
        </div>
        <div className="text-center p-6 rounded-lg border">
          <h3 className="text-xl font-bold mb-3">模板丰富</h3>
          <p className="text-gray-600">海量精美模板，助你快速创作</p>
        </div>
      </div>
    </main>
  );
};

export default Main;
