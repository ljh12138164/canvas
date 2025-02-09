import { Skeleton } from '@/app/_components/ui/skeleton';
import { useTemplate } from '@/app/_hook/query/useTemaplate';
import type {
  GetTemplateResponseType,
  GetUserTemplateResponseType,
} from '@/app/_hook/query/useTemaplate';
import type { Edit } from '@/app/_types/Edit';
import Image from 'next/image';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { Response } from '../Comand/Response';

export const myTrigger = (
  item: GetTemplateResponseType[number] | GetUserTemplateResponseType[number],
) => (
  <div>
    <Image src={item.image} alt={item.name} fill className="object-cover" quality={60} />
    <div className="absolute bottom-0 left-0 w-full h-[40px] bg-black/50 flex items-center justify-center">
      <p className="text-white text-center">{item.name}</p>
    </div>
  </div>
);

export default function DefaultTemplateList({ editor }: { editor: Edit | undefined }) {
  const { dataDefault, isLoadingDefault } = useTemplate();
  const responseRef = useRef<{
    closeModel: () => void;
  } | null>(null);
  if (isLoadingDefault)
    return (
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[200px]" />
      </div>
    );
  if (dataDefault?.length === 0) return <div>暂无模板</div>;
  return (
    <div className="grid grid-cols-2 gap-2">
      {dataDefault?.map((item) => (
        <section key={item.id} className="w-full h-[200px] relative cursor-pointer">
          <Response
            myTrigger={myTrigger(item)}
            title="选择模板"
            showDescription={true}
            variant="destructive"
            description="选择模板将清空当前画布"
            ref={responseRef}
            onConfirm={async () => {
              toast.loading('加载中...');
              await editor?.loadFromJson(item.json);
              responseRef.current?.closeModel();
              toast.dismiss();
              toast.success('加载成功');
            }}
          />
        </section>
      ))}
    </div>
  );
}
