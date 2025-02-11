import { Card } from '@/app/_components/ui/card';
import { DEFAULT_TEMPLATE } from '@/app/_database/user';
import { useBoardDeleteQuery, useBoardQuery } from '@/app/_hook/query/useBoardQuery';
import { useTemplate, useUserTemplate } from '@/app/_hook/query/useTemaplate';
import { useQueryClient } from '@tanstack/react-query';
import { LayoutTemplate, MoreHorizontal, Pencil, PlusCircle, Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import BoardCreateFrom from '../Board/BoardCreateFrom';
import ColorCard from '../Comand/ColorCard';
import { Response } from '../Comand/Response';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

const TemplateMain = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const { mutate: deleteBoard, isPending: deleteBoardPending } = useBoardDeleteQuery();
  const { mutate, isPending } = useBoardQuery();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['templateUser'] });
  }, []);
  const { dataDefault, isLoadingDefault } = useTemplate();
  const { dataUserTemplate, isLoadingUserTemplate } = useUserTemplate();
  const router = useRouter();
  const closeref = useRef<HTMLButtonElement>(null);
  const responseRef = useRef<{ closeModel: () => void } | null>(null);
  return (
    <ScrollArea className="h-[calc(100vh-100px)]">
      <main className="min-w-[380px] p-6">
        <ColorCard
          title="模板是预设的画布，可以用于快速创建画布。"
          icon={
            <LayoutTemplate className="text-blue-500 text-[2rem] animate-pulse hover:animate-spin" />
          }
          className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 border-none shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <Response
              title="创建模板"
              description="确定创建模板吗？"
              ref={responseRef}
              showFooter={false}
              onConfirm={() => {
                responseRef.current?.closeModel();
              }}
            >
              <BoardCreateFrom
                type="create"
                isTemplate={true}
                userId={userId}
                mutate={mutate as any}
                closeref={responseRef}
                setTemplate={true}
                templateData={{ image: DEFAULT_TEMPLATE }}
              >
                <DialogFooter className="flex gap-2 w-full">
                  <Button
                    onClick={() => responseRef.current?.closeModel()}
                    variant="outline"
                    type="button"
                  >
                    取消
                  </Button>
                  <Button type="submit">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    创建模板
                  </Button>
                </DialogFooter>
              </BoardCreateFrom>
            </Response>
          </div>
        </ColorCard>

        <h1 className="text-lg font-bold mb-4">默认模板</h1>
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-6">
          {isLoadingDefault ? (
            <>
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
            </>
          ) : (
            dataDefault?.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <PhotoProvider>
                    <PhotoView src={template.image}>
                      <Image
                        src={template.image}
                        alt={template.name}
                        fill
                        priority
                        quality={80}
                        className="object-cover w-full h-full"
                      />
                    </PhotoView>
                  </PhotoProvider>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{template.name}</h2>
                  <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm">
                          使用模板
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle> {template.name} </DialogTitle>
                        </DialogHeader>
                        <BoardCreateFrom
                          type="create"
                          isTemplate={true}
                          userId={userId}
                          mutate={mutate as any}
                          closeref={closeref}
                          templateData={template}
                        >
                          <DialogFooter className="flex gap-2 w-full">
                            <Button onClick={() => closeref.current?.click()} variant="outline">
                              取消
                            </Button>
                            <Button variant="default" type="submit" disabled={isPending}>
                              使用模板
                            </Button>
                          </DialogFooter>
                        </BoardCreateFrom>
                      </DialogContent>
                    </Dialog>
                    <PhotoProvider>
                      <PhotoView src={template.image}>
                        <Button variant="outline" size="sm">
                          预览
                        </Button>
                      </PhotoView>
                    </PhotoProvider>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        <h1 className="text-lg font-bold my-4">我的模板</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-6">
          {isLoadingUserTemplate ? (
            <>
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
            </>
          ) : (
            dataUserTemplate?.map((template, index) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-video relative border">
                  <PhotoProvider>
                    <PhotoView src={template.image}>
                      <Image
                        src={template.image}
                        alt={template.name || '用户图片'}
                        fill
                        priority={index < 4}
                        quality={80}
                        className="object-cover w-full h-full"
                      />
                    </PhotoView>
                  </PhotoProvider>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{template.name}</h2>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm">
                          使用模板
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle> {template.name} </DialogTitle>
                        </DialogHeader>
                        <BoardCreateFrom
                          type="create"
                          isTemplate={true}
                          userId={userId}
                          mutate={mutate as any}
                          closeref={closeref}
                          templateData={template}
                        >
                          <DialogFooter className="flex gap-2 w-full">
                            <Button onClick={() => closeref.current?.click()} variant="outline">
                              取消
                            </Button>
                            <Button variant="default" type="submit" disabled={isPending}>
                              使用模板
                            </Button>
                          </DialogFooter>
                        </BoardCreateFrom>
                      </DialogContent>
                    </Dialog>
                    <PhotoProvider>
                      <PhotoView src={template.image}>
                        <Button variant="outline" size="sm">
                          预览
                        </Button>
                      </PhotoView>
                    </PhotoProvider>
                    <section className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full cursor-pointer"
                            onClick={() => {
                              router.push(`/EditTemplate/${template.id}`);
                            }}
                          >
                            <Pencil className="size-4" /> 编辑
                          </Button>
                          <DropdownMenuItem asChild>
                            <Response
                              title="确定删除模板吗？"
                              description="删除后无法恢复"
                              variant="destructive"
                              disabled={deleteBoardPending}
                              ref={responseRef}
                              myTrigger={
                                <Button variant="ghost" size="sm" className="w-full">
                                  <Trash className="size-4" />
                                  删除
                                </Button>
                              }
                              onConfirm={() => {
                                deleteBoard(
                                  { json: { id: template.id, image: template.image } },
                                  {
                                    onSuccess: () => {
                                      queryClient.invalidateQueries({
                                        queryKey: ['templateUser'],
                                      });
                                    },
                                  },
                                );
                              }}
                            />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </section>
                  </div>
                </div>
              </Card>
            ))
          )}
          {dataUserTemplate?.length === 0 && (
            <div className="col-span-4 text-center text-gray-500">你还没有设置模板</div>
          )}
        </div>
      </main>
    </ScrollArea>
  );
};

export default TemplateMain;
