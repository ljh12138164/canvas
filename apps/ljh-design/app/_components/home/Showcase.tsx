'use client';

import { AspectRatio } from '@/app/_components/ui/aspect-ratio';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent } from '@/app/_components/ui/card';
import { cn } from '@/app/_lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// 模拟作品数据
const showcaseItems = [
  {
    id: 1,
    title: '社交媒体海报',
    category: '海报',
    image:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 2,
    title: '品牌宣传册',
    category: '宣传册',
    image:
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 3,
    title: '产品展示',
    category: '产品',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 4,
    title: '活动邀请函',
    category: '邀请函',
    image:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 5,
    title: '网站设计',
    category: '网站',
    image:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 6,
    title: '名片设计',
    category: '名片',
    image:
      'https://images.unsplash.com/photo-1598367772323-3be5a8b7b65c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
];

// 分类列表
const categories = ['全部', '海报', '宣传册', '产品', '邀请函', '网站', '名片'];

const Showcase = () => {
  const [activeCategory, setActiveCategory] = useState('全部');

  const filteredItems =
    activeCategory === '全部'
      ? showcaseItems
      : showcaseItems.filter((item) => item.category === activeCategory);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">精选作品展示</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          浏览由我们的用户使用ljh-design创建的精美设计作品
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* 作品展示网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <ShowcaseCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* 查看更多按钮 */}
      <div className="text-center mt-12">
        <Link href="/board/formue">
          <Button variant="outline" size="lg" className="rounded-full px-8">
            查看更多作品
          </Button>
        </Link>
      </div>
    </section>
  );
};

const ShowcaseCard = ({ item, index }: { item: (typeof showcaseItems)[0]; index: number }) => {
  return (
    <Card
      className={cn(
        'overflow-hidden border-none shadow-lg group hover:shadow-xl transition-all duration-300',
        'opacity-0 animate-in fade-in-50 slide-in-from-bottom-10',
        index % 3 === 0 ? 'delay-0' : index % 3 === 1 ? 'delay-150' : 'delay-300',
      )}
    >
      <CardContent className="p-0">
        <div className="relative">
          <AspectRatio ratio={4 / 3}>
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-medium text-lg">{item.title}</h3>
            <p className="text-white/80 text-sm">{item.category}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Showcase;
