import { Providers } from '@/app/_provide/providers';
import CallToAction from './_components/home/CallToAction';
import Features from './_components/home/Features';
import Footer from './_components/home/Footer';
import Hero from './_components/home/Hero';
import NavBar from './_components/home/Navbar';
import Showcase from './_components/home/Showcase';
import Testimonials from './_components/home/Testimonials';
import { ScrollArea } from './_components/ui/scroll-area';

export default async function Home() {
  return (
    <Providers>
      <ScrollArea className="h-[100dvh]">
        {/* 导航栏 */}
        <NavBar />

        <div className="flex flex-col gap-16 md:gap-24 pb-16">
          {/* 英雄区域 */}
          <Hero />

          {/* 特性展示 */}
          <Features />

          {/* 作品展示 */}
          {/* <Showcase /> */}

          {/* 用户评价 */}
          {/* <Testimonials /> */}

          {/* 行动召唤 */}
          <CallToAction />

          {/* 页脚 */}
          <Footer />
        </div>
      </ScrollArea>
    </Providers>
  );
}
