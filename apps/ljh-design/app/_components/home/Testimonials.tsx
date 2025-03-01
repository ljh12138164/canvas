'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/Avatar';
import { Card, CardContent } from '@/app/_components/ui/card';
import { cn } from '@/app/_lib/utils';

// 模拟用户评价数据
const testimonials = [
  {
    id: 1,
    content:
      'ljh-design让我的设计工作变得如此简单，即使没有专业设计背景，我也能创建出令人惊艳的作品。',
    author: '张明',
    role: '市场营销经理',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    content:
      '作为一名自由设计师，ljh-design大大提高了我的工作效率。丰富的模板和素材让我能够快速完成客户需求。',
    author: '李华',
    role: '自由设计师',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    content: 'AI辅助功能太棒了！它能根据我的简单描述生成设计元素，为我节省了大量时间。',
    author: '王芳',
    role: '内容创作者',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    content: '我们团队使用ljh-design进行设计，一键分享功能让工作流程变得无缝顺畅。',
    author: '赵强',
    role: '创业公司CEO',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

const Testimonials = () => {
  return (
    <section className="bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">用户心声</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            听听我们的用户如何评价ljh-design，他们的成功故事将激励您
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={cn(
                'border-none shadow-md hover:shadow-lg transition-all duration-300',
                'animate-fade-in',
                // 添加延迟效果
                index % 2 === 0 ? '' : 'animation-delay-200',
                index >= 2 ? 'animation-delay-400' : '',
              )}
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <span className="absolute text-6xl text-primary/20 -top-6 -left-2">"</span>
                    <p className="relative text-lg italic">{testimonial.content}</p>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
