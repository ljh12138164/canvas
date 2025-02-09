import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

const AdminPeding = ({ title }: { title: string }) => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <nav className="h-10 flex p-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        {/* 时间选择 */}
        <section className="ml-auto">
          <Skeleton className="w-20 h-10" />
        </section>
      </nav>
      <Separator />
      <Skeleton className="w-full h-full" />
    </div>
  );
};

export default AdminPeding;
