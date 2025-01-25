import { Skeleton } from '@/app/_components/ui/skeleton';
import { nanoid } from 'nanoid';

export const Loading = () => {
  return (
    <div className="w-full space-y-5 p-4">
      {/* 内容区域骨架 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_) => (
          <Skeleton key={nanoid()} className="rounded-lg h-[150px]" />
        ))}
      </div>
    </div>
  );
};
