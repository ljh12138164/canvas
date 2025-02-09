import { useGetFormue } from '@/app/_hook/query/useShow';
import { useInformation } from '@/app/_hook/useInformation';
import { ScrollArea } from '../ui/scroll-area';
import { FormueItem } from './FormueItem';

export default function FormueList() {
  const { formueData, formueLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetFormue();
  const bottomRef = useInformation({
    disabled: formueLoading || !hasNextPage || isFetchingNextPage,
    fetchNextPage,
    option: {
      threshold: 0.5,
    },
  });
  // 无数据
  if (!formueData || formueData.pages.length === 0)
    return <div className="text-center text-sm text-foreground h-full w-full ">无数据</div>;

  // 渲染数据列表
  return (
    <>
      <div className="flex flex-col gap-4">
        {formueData.pages.map((item) =>
          item.data.map((item) => <FormueItem key={item.id} item={item} />),
        )}
      </div>
      {/* 无限加载 */}
      <div ref={bottomRef} />
      {isFetchingNextPage && (
        <div className="text-center text-sm text-foreground h-full w-full  mt-2">加载中...</div>
      )}
      {!hasNextPage && (
        <div className="text-center text-sm text-foreground h-full w-full mt-2">已加载全部</div>
      )}
    </>
  );
}
