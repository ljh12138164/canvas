'use client';

import { Button } from '@/app/_components/ui/button';
import useUsers from '@/app/_hook/useUser';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();
  const { user, loading } = useUsers({ redirects: false });

  return (
    <section className="relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            释放创意，<span className="text-blue-600 dark:text-blue-400">设计无限可能</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in animation-delay-200">
            简单易用的在线设计工具，让您轻松创建精美设计，无需专业技能，即刻开始创作
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in animation-delay-300">
            <Button
              size="lg"
              disabled={loading}
              onClick={() => (user ? router.push('/board') : router.push('/sign-in'))}
              className="rounded-full px-8 bg-blue-600 hover:bg-blue-700"
            >
              开始设计
            </Button>

            <Link href={user ? '/board/template' : '/sign-in'}>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                浏览模板
              </Button>
            </Link>
          </div>

          {/* 特性标签 */}
          <div className="flex flex-wrap justify-center gap-3 mt-12 animate-fade-in animation-delay-500">
            {['AI辅助设计', '海量模板', '丰富素材', '一键分享'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
