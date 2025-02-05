import { Response } from '@/app/_components/Comand/Response';
import { Skeleton } from '@/app/_components/ui/skeleton';
import { useUserTemplate } from '@/app/_hook/query/useTemaplate';
import type { Edit } from '@/app/_types/Edit';
import { useRef } from 'react';
import { myTrigger } from './DefaultTemplateList';

export default function UserTemplateList({ editor }: { editor: Edit | undefined }) {
  const responseRef = useRef<{
    closeModel: () => void;
  } | null>(null);
  const { dataUserTemplate, isLoadingUserTemplate } = useUserTemplate();
  if (isLoadingUserTemplate)
    return (
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[200px]" />
      </div>
    );
  if (dataUserTemplate?.length === 0) return <div>暂无模板</div>;
  return (
    <div className="grid grid-cols-2 gap-2">
      {dataUserTemplate?.map((item) => (
        <section key={item.id} className="w-full h-[200px] relative cursor-pointer">
          <Response
            myTrigger={myTrigger(item)}
            title="选择模板"
            description="选择模板将清空当前画布"
            ref={responseRef}
            onConfirm={() => {
              editor?.loadFromJson(item.json, () => {
                responseRef.current?.closeModel();
              });
            }}
          />
        </section>
      ))}
    </div>
  );
}
