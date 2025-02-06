import type { GetFormueResponseType } from '@/app/_hook/query/useShow';
import { useUser } from '@/app/_store/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaClone, FaComment, FaThumbsUp } from 'react-icons/fa';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

interface FormueItemProps {
  item: GetFormueResponseType['data'][number];
}

export const FormueItem = ({ item }: FormueItemProps) => {
  const { user } = useUser();
  const router = useRouter();
  return (
    <Card className="p-4 cursor-pointer" onClick={() => router.push(`/board/formue/${item.id}`)}>
      <main className="flex w-full gap-4">
        <PhotoProvider>
          <PhotoView src={item.board.image}>
            <Image
              onClick={(e) => e.stopPropagation()}
              src={item.board.image}
              alt={item.title}
              width={100}
              height={125}
              className="object-cover"
            />
          </PhotoView>
        </PhotoProvider>
        <section aria-describedby="formue-item-content" className="flex-1 flex flex-col">
          <section className="flex justify-between text-sm font-bold w-full">
            <span className="text-xl mb-2 ">标题: {item.title}</span>
            <p className="text-sm text-gray-500 whitespace-nowrap flex gap-4 items-center">
              <span className="flex gap-2 items-center">
                <FaComment />
                <span>评论: {item.answers.length}</span>
              </span>
              <span className="flex gap-2 items-center">
                <FaClone />
                <span>克隆数: {item.clone}</span>
              </span>
              <span className="flex gap-2 items-center">
                <FaThumbsUp />
                <span>点赞数: {item.upvotes.length}</span>
              </span>
            </p>
          </section>
          <section className="flex gap-2">
            <span className="text-sm text-gray-500">标签:</span>
            {item.tags.split(',').map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </section>
          <div className="flex items-center gap-2 mt-auto">
            <p className="text-sm text-gray-500">发布者:</p>
            <Avatar>
              <AvatarImage src={item.profiles.image} />
              <AvatarFallback>{item.profiles.name}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-gray-500">{item.profiles.name}</p>
            {user?.user.user_metadata.sub === item.profiles.id && <span>我</span>}
          </div>
        </section>
      </main>
    </Card>
  );
};
