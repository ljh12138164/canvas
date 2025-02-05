import { useBoardQuery } from '@/app/_hook/query/useBoardQuery';
import { useTemplate, useUserTemplate } from '@/app/_hook/query/useTemaplate';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { DEFAULT_TEMPLATE } from '@/app/_database/user';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import BoardCreateFrom from '../Board/BoardCreateFrom';
import { Response } from '../Comand/Response';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">模板中心</h1>
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
        <h2 className="text-lg font-bold mb-4">默认模板</h2>
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
                        quality={80}
                        className="object-cover w-full h-full"
                      />
                    </PhotoView>
                  </PhotoProvider>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
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
        <h2 className="text-lg font-bold my-4">我的模板</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-6">
          {isLoadingUserTemplate ? (
            <>
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
              <Skeleton className="w-full h-[200px]" />
            </>
          ) : (
            dataUserTemplate?.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-video relative border">
                  <PhotoProvider>
                    <PhotoView src={template.image}>
                      <Image
                        src={template.image}
                        alt={template.name || '用户图片'}
                        fill
                        quality={80}
                        className="object-cover w-full h-full"
                      />
                    </PhotoView>
                  </PhotoProvider>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
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
                          <DropdownMenuItem asChild>
                            <Button variant="ghost" size="sm" className="w-full cursor-pointer">
                              删除
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full cursor-pointer"
                              onClick={() => {
                                router.push(`/EditTemplate/${template.id}`);
                              }}
                            >
                              编辑
                            </Button>
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
