'use client';
import { useDeleteMaterial, useEditMaterial, useMaterial } from '@/app/_hook/query/useMaterial';
import { useQueryClient } from '@tanstack/react-query';
import { Image, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type ElementType, useRef } from 'react';
import toast from 'react-hot-toast';
import type { IconBaseProps } from 'react-icons';
import { FaCircle, FaDiamond, FaSquare, FaSquareFull } from 'react-icons/fa6';
import { IoIosStar } from 'react-icons/io';
import { IoTriangle } from 'react-icons/io5';
import ColorCard from '../Comand/ColorCard';
import { Response } from '../Comand/Response';
import { MeterialList } from '../EditComponents/asider/MeterialList';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { Form } from './Form';
type IconType = {
  icon: ElementType;
  index: number;
  props: IconBaseProps;
};
const metalIcon: IconType[] = [
  { icon: FaCircle, props: { className: 'w-full h-full' }, index: 0 },
  { icon: FaSquareFull, props: { className: 'w-full h-full' }, index: 1 },
  { icon: FaSquare, props: { className: 'w-full h-full' }, index: 2 },
  { icon: FaDiamond, props: { className: 'w-full h-full' }, index: 3 },
  { icon: IoIosStar, props: { className: 'w-full h-full' }, index: 4 },
  { icon: IoTriangle, props: { className: 'w-full h-full' }, index: 5 },
  { icon: IoTriangle, props: { className: 'rotate-180 w-full h-full' }, index: 6 },
];

const MaterialMain = () => {
  const ref = useRef<{ closeModel: () => void } | null>(null);
  const ref1 = useRef<{ closeModel: () => void } | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading } = useMaterial();
  const { mutate, isPending: isDeletePending } = useDeleteMaterial();
  const { mutate: editMutate, isPending: isEditPending } = useEditMaterial();
  return (
    <ScrollArea className="h-[calc(100vh-100px)]">
      <main className="min-w-[380px] p-6">
        <ColorCard
          title="素材中心来开始构建你的画布"
          icon={<Image className="text-blue-500 text-[2rem] animate-pulse hover:animate-spin" />}
          className="bg-linear-to-r from-pink-600 via-orange-500 to-yellow-400 border-none shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex flex-col items-center mb-6">
            <Button variant="outline" onClick={() => router.push('/EditMaterial')}>
              <PlusCircle />
              添加素材
            </Button>
          </div>
        </ColorCard>
      </main>
      <h2 className="text-xl font-bold mb-4 px-6">默认素材</h2>
      <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 px-6 mb-2">
        {metalIcon.map((item) => (
          <div key={item.index} className="flex items-center justify-center p-2 border rounded-lg">
            <item.icon {...item.props} />
          </div>
        ))}
      </section>
      <h2 className="text-xl font-bold my-4 px-6">我的素材</h2>
      <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
        {isLoading && (
          <>
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
          </>
        )}
        {!isLoading &&
          data?.map((item) => (
            <section
              key={item.id}
              className=" border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <MeterialList item={item} />
              <footer className="flex items-center justify-between p-3 border-t ">
                <span className="text-sm font-medium">{item.name || '风景模板'}</span>
                <div className="flex gap-2">
                  <Response
                    title="编辑素材"
                    description="编辑素材名称"
                    ref={ref}
                    showFooter={false}
                  >
                    <Form
                      defaultValues={item}
                      type="edit"
                      onSuccess={() => ref?.current?.closeModel()}
                    >
                      <section className="flex mt-4">
                        <div className="flex gap-2 ml-auto">
                          <Button
                            onClick={() => ref?.current?.closeModel()}
                            variant="outline"
                            type="button"
                          >
                            取消
                          </Button>
                          <Button type="submit" disabled={isEditPending}>
                            {isEditPending ? '编辑中...' : '编辑'}
                          </Button>
                        </div>
                      </section>
                    </Form>
                  </Response>
                  <Response
                    title="删除素材"
                    description="是否删除素材"
                    variant="destructive"
                    showDescription={true}
                    myTrigger={<Button variant="destructive">删除</Button>}
                    ref={ref1}
                    showFooter={false}
                  >
                    <section className="flex gap-2 ml-auto">
                      <Button variant="outline" onClick={() => ref1?.current?.closeModel()}>
                        取消
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          mutate(
                            { json: { id: item.id } },
                            {
                              onSuccess: () => {
                                ref1?.current?.closeModel();
                                toast.success('删除成功');
                                queryClient.invalidateQueries({ queryKey: ['material'] });
                              },
                            },
                          )
                        }
                        disabled={isDeletePending}
                      >
                        {isDeletePending ? '删除中...' : '删除'}
                      </Button>
                    </section>
                  </Response>
                </div>
              </footer>
            </section>
          ))}
      </section>
    </ScrollArea>
  );
};

export default MaterialMain;
