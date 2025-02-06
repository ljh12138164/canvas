import { useMaterial } from '@/app/_hook/query/useMaterial';
import { Skeleton } from '../../ui/skeleton';

const MyMaterialList = () => {
  const { data, isLoading } = useMaterial();
  if (isLoading)
    return (
      <>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </>
    );
  if (data?.length === 0)
    return <div className="text-center text-muted-foreground col-span-3">暂无上传素材</div>;
  return <div>我的素材</div>;
};

export default MyMaterialList;
