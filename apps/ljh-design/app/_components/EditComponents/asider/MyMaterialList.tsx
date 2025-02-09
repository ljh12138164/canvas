import { useMaterial } from '@/app/_hook/query/useMaterial';
import type { Edit } from '@/app/_types/Edit';
import { Skeleton } from '../../ui/skeleton';
import { MeterialList } from './MeterialList';

const MyMaterialList = ({ editor }: { editor: Edit | undefined }) => {
  const { data, isLoading } = useMaterial();
  if (isLoading)
    return (
      <>
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
      </>
    );
  if (data?.length === 0)
    return <div className="text-center text-muted-foreground col-span-3">暂无上传素材</div>;
  return (
    <>
      {data?.map((item) => (
        <MeterialList item={item} key={item.id} editor={editor} />
      ))}
    </>
  );
};

export default MyMaterialList;
