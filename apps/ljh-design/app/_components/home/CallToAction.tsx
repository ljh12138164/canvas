'use client';

import { Button } from '@/app/_components/ui/button';
import useUsers from '@/app/_hook/useUser';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CallToAction = () => {
  const router = useRouter();
  const { user, loading } = useUsers({ redirects: false });

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-400 p-8 md:p-12">
        {/* 装饰元素 */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left text-white max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好开始您的设计之旅了吗？</h2>
            <p className="text-white/80 text-lg mb-0 md:mb-6">
              立即注册，免费体验ljh-design的强大功能，释放您的创意潜能
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="default"
              className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-8"
              disabled={loading}
              onClick={() => (user ? router.push('/board') : router.push('/sign-in'))}
            >
              {user ? '进入工作区' : '免费注册'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {!user && (
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-black dark:text-black dark:bg-zinc-200 hover:dark:bg-zinc-300 rounded-full px-8"
                >
                  登录账号
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
