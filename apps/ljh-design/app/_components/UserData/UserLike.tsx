import type { UserResponseType } from '@/app/_hook/query/useUser';
import dayjs from 'dayjs';
import Link from 'next/link';
import AvatarImage from '../Comand/AvatarImage';
import { Loading } from './Loading';

interface UserLike {
  data: UserResponseType | undefined;
  loading: boolean;
}

export const UserLike = ({ data, loading }: UserLike) => {
  if (loading) return <Loading />;
  if (!data?.[0]?.show)
    return (
      <section className="flex justify-center items-center">
        <p className="text-2xl text-gray-500">暂无数据</p>
      </section>
    );

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   xl:grid-cols-4  gap-4 space-y-5 p-4">
      {data.map((item) => (
        <div
          key={item.show.id}
          className="flex  group h-[100px] border dark:border-gray-800  border-gray-200 relative overflow-hidden rounded-lg transition-all hover:scale-105 cursor-pointer"
        >
          <Link
            href={`/board/formue/${item.show.id}`}
            className="flex flex-col  justify-center w-full p-4"
          >
            <div className="">
              <h3 className="text-sm font-medium line-clamp-2">标题：{item.show.title}</h3>
            </div>
            <div className="flex">
              <p className="text-sm text-gray-500 line-clamp-1">
                点赞时间：{dayjs(item.created_at).format('YYYY年MM月DD日')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 max-w-[100px] ">发布者：</p>
              <AvatarImage
                userInfo={item.show.profiles}
                src={item.show.profiles.image || ''}
                alt={item.show.profiles.name || '用户'}
                width={30}
                height={30}
                priority
              />
            </div>
          </Link>
        </div>
      ))}
    </section>
  );
};
