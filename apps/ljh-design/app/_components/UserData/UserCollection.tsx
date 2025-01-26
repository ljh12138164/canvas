import type { UserCollectionResponseType } from '@/app/_hook/query/useUser';
import dayjs from 'dayjs';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Loading } from './Loading';

interface UserCollectionProps {
  data: UserCollectionResponseType | undefined;
  loading: boolean;
}

export const UserColleciton = ({ data, loading }: UserCollectionProps) => {
  if (loading) return <Loading />;
  if (!data?.length)
    return (
      <section className="flex justify-center items-center ">
        <p className="text-2xl text-gray-500">暂无数据</p>
      </section>
    );

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {data.map((item) => (
        <div
          key={item.show.id}
          className="flex  group h-[100px] border dark:border-gray-800  border-gray-200 relative overflow-hidden rounded-lg transition-all hover:scale-105 cursor-pointer"
        >
          <Link
            href={`/board/formue/${item.show.id}`}
            className="flex flex-col  justify-center w-full p-4"
          >
            <Avatar>
              <AvatarImage src={item.show.profiles.image} />
              <AvatarFallback>{item.show.profiles.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="">
              <h3 className="text-sm font-medium dark:text-white text-gray-500 line-clamp-2">
                标题：{item.show.title}
              </h3>
            </div>
            <div className="flex">
              <p className="text-sm text-gray-500">
                收藏时间：{dayjs(item.created_at).format('YYYY年MM月DD日')}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </section>
  );
};