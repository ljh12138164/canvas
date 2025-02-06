import type { GetShowResponseType } from '@/app/_hook/query/useShow';
import { useUser } from '@/app/_store/auth';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import BoardCreateFrom from '../Board/BoardCreateFrom';
import { Response } from '../Comand/Response';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function ShowHead({
  showData,
  remarkRef,
}: { showData: GetShowResponseType; remarkRef: React.RefObject<HTMLDivElement | null> }) {
  const { user } = useUser();
  const [cloneType, setCloneType] = useState<'template' | 'board'>('template');
  const onClick = () => remarkRef.current?.scrollIntoView({ behavior: 'smooth' });
  const responseRef = useRef<{
    closeModel: () => void;
  }>(null);
  const mutate = () => {};
  return (
    <section className="flex flex-col gap-3 pb-4 border-b border-gray-200">
      <h2 className="text-2xl font-bold">{showData.title}</h2>
      <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
        <section className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={showData.profiles.image} />
            <AvatarFallback>{showData.profiles.name}</AvatarFallback>
          </Avatar>
          <span className="text-sm whitespace-nowrap">
            {showData.profiles.name}
            {user?.user.user_metadata.sub === showData.profiles.id && (
              <span className="ml-2">(我)</span>
            )}
          </span>
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
        {user?.user.user_metadata.sub !== showData.profiles.id && (
          <Response
            title="克隆"
            description="克隆到我的模板或看板"
            ref={responseRef}
            showFooter={false}
            onConfirm={() => {
              responseRef.current?.closeModel();
            }}
          >
            <BoardCreateFrom
              defaultValues={showData.board}
              type="create"
              isClone={true}
              cloneType={cloneType}
              closeref={responseRef}
              mutate={mutate as any}
            >
              <Select
                value={cloneType}
                onValueChange={(value) => setCloneType(value as 'template' | 'board')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择克隆类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template">模板</SelectItem>
                  <SelectItem value="board">看板</SelectItem>
                </SelectContent>
              </Select>
              <section className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8"
                  onClick={() => {
                    responseRef.current?.closeModel();
                  }}
                >
                  取消
                </Button>
                <Button type="submit" className="h-8">
                  克隆
                </Button>
              </section>
            </BoardCreateFrom>
          </Response>
        )}
      </div>
    </section>
  );
}
