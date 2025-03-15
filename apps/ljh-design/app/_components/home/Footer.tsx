'use client';

import { LogoWithText } from '@/app/_components/ui/Logo';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* 品牌和订阅 */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <LogoWithText size="lg" />
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              释放创意，设计未来。ljh-design是一款简单易用的在线设计工具，帮助您轻松创建精美设计。
            </p>
          </div>

          {/* 链接分组 */}
        </div>

        {/* 底部版权和社交媒体 */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t mt-12 pt-8 gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ljh-design. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
