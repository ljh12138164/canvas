'use client';

import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { Render } from '../Formue/Render';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface PostListProps {
  items: Array<{
    id: string;
    title: string;
    explanation?: string;
    created_at: string;
    tags?: string;
    userId: string;
    profiles?: {
      name: string;
      image: string;
    };
  }>;
  type: 'posts' | 'likes' | 'collections';
}

export function PostList({ items = [], type }: PostListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {type === 'posts' && '该用户还没有发布任何帖子'}
          {type === 'likes' && '该用户还没有点赞任何帖子'}
          {type === 'collections' && '该用户还没有收藏任何帖子'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
              {item.tags && (
                <Badge variant="outline" className="ml-2 shrink-0">
                  {item.tags}
                </Badge>
              )}
            </div>
            <CardDescription className="flex items-center gap-2 text-xs">
              <CalendarIcon className="h-3 w-3" />
              {formatDistanceToNow(new Date(item.created_at), {
                locale: zhCN,
                addSuffix: true,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <section className="text-sm line-clamp-3">
              {item.explanation ? (
                <Render content={item.explanation} />
              ) : (
                <span className="text-muted-foreground">暂无详细描述</span>
              )}
            </section>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.profiles?.image || ''} alt={item.profiles?.name} />
                <AvatarFallback>{item.profiles?.name?.substring(0, 1) || '用'}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{item.profiles?.name || '匿名用户'}</span>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/board/formue/${item.id}`}>查看详情</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
