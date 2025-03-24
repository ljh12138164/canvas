import { Card } from '@/app/_components/ui/card';
import type { GetFormueResponseType } from '@/app/_hook/query/useShow';
import { genMaterialPreview } from '@/app/_lib/editor/editor';
import { useUser } from '@/app/_store/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaClone, FaComment, FaThumbsUp } from 'react-icons/fa';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import AvatarImage from '../Comand/AvatarImage';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

interface FormueItemProps {
  item: GetFormueResponseType['data'][number];
}

export const FormueItem = ({ item }: FormueItemProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [images, setImage] = useState('');
  useEffect(() => {
    if (item.type === 'material')
      genMaterialPreview(item.material.options, 100, 125).then((res) => {
        setImage(res);
      });
  }, []);
  if (item.type === 'template') {
    return (
      <Card className="p-4 cursor-pointer" onClick={() => router.push(`/board/formue/${item.id}`)}>
        <main className="flex w-full gap-4">
          <PhotoProvider>
            <PhotoView src={item.board.image}>
              <Image
                onClick={(e) => e.stopPropagation()}
                src={item.board.image}
                alt={item.title}
                priority
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
              <AvatarImage
                userInfo={item.profiles!}
                src={item.profiles.image || ''}
                alt={item.profiles.name || '用户'}
                width={30}
                height={30}
                priority
              />
              <p className="text-sm text-gray-500">{item.profiles.name}</p>
              {user?.user.user_metadata.sub === item.profiles.id && <span>我</span>}
            </div>
          </section>
        </main>
      </Card>
    );
  }
  return (
    <Card className="p-4 cursor-pointer" onClick={() => router.push(`/board/formue/${item.id}`)}>
      <main className="flex w-full gap-4">
        {images ? (
          <Image
            onClick={(e) => e.stopPropagation()}
            src={images}
            alt={item.title}
            width={100}
            height={125}
            className="object-cover"
          />
        ) : (
          <Skeleton className="w-10 h-10" />
        )}
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
            {item.tags.split(',').length > 0 ? (
              item.tags.split(',').map((tag) => {
                if (tag.length > 0) return <Badge key={tag}>{tag}</Badge>;
                return null;
              })
            ) : (
              <p className="text-sm text-gray-500">暂无标签</p>
            )}
          </section>
          <div className="flex items-center gap-2 mt-auto">
            <p className="text-sm text-gray-500">发布者:</p>
            <AvatarImage
              userInfo={item.profiles!}
              src={item.profiles.image || ''}
              alt={item.profiles.name || '用户'}
              width={30}
              height={30}
              priority
            />
            <p className="text-sm text-gray-500">{item.profiles.name}</p>
            {user?.user.user_metadata.sub === item.profiles.id && <span>我</span>}
          </div>
        </section>
      </main>
    </Card>
  );
};
