import type { GetShowResponseType } from '@/app/_hook/query/useShow';
import dayjs from 'dayjs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function ShowHead({
  showData,
  remarkRef,
}: { showData: GetShowResponseType; remarkRef: React.RefObject<HTMLDivElement | null> }) {
  const onClick = () => remarkRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="flex flex-col gap-3 pb-4 border-b border-gray-200">
      <h2 className="text-2xl font-bold">{showData.title}</h2>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <section className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={showData.profiles.image} />
            <AvatarFallback>{showData.profiles.name}</AvatarFallback>
          </Avatar>
          <span className="text-sm whitespace-nowrap">{showData.profiles.name}</span>
        </section>
        <span className="text-sm whitespace-nowrap">
          发布时间:{dayjs(showData.created_at).format('YYYY年MM月DD日 HH:mm:ss')}
        </span>
        {showData.tags && (
          <div className="mr-2 flex flex-wrap gap-2">
            标签：
            {showData.tags.split(',').map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
        <Button onClick={onClick} type="button" variant="outline" className="h-8">
          跳转到评论
        </Button>
      </div>
    </section>
  );
}
