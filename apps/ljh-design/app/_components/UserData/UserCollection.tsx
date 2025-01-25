import type { UserCollectionResponseType } from '@/app/_hook/query/useUser';
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
      <section className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-500">暂无数据</p>
      </section>
    );

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 space-y-5 p-4">
      {data.map((item) => (
        <div
          key={item.show.id}
          className="group relative w-full h-[150px] overflow-hidden rounded-lg transition-all hover:scale-105"
        >
          <Link href={`/board/detail/${item.show.id}`}>
            <Avatar>
              <AvatarImage src={item.show.profiles.image} />
              <AvatarFallback>{item.show.profiles.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-sm font-medium text-white line-clamp-2">{item.show.title}</h3>
            </div>
          </Link>
        </div>
      ))}
    </section>
  );
};
