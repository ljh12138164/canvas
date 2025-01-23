import type { GetFormueResponseType } from '@/app/_hook/query/useShow';
import { useRouter } from 'next/navigation';
import { FaClone, FaComment, FaThumbsUp } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface FormueItemProps {
  item: GetFormueResponseType['data'][number];
}

export const FormueItem = ({ item }: FormueItemProps) => {
  const router = useRouter();
  return (
    <Card className="p-4 cursor-pointer" onClick={() => router.push(`/board/formue/${item.id}`)}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span className="text-sm ">标题: {item.title}</span>
          <p className="text-sm text-gray-500 whitespace-nowrap flex gap-2 items-center">
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
        </CardTitle>
      </CardHeader>
      <CardContent aria-describedby="formue-item-content">
        <CardDescription className="flex gap-2">
          <span className="text-sm text-gray-500">标签:</span>
          {item.tags.split(',').map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">发布者:</p>
          <Avatar>
            <AvatarImage src={item.profiles.image} />
            <AvatarFallback>{item.profiles.name}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-gray-500">{item.profiles.name}</p>
        </div>
      </CardFooter>
    </Card>
  );
};
