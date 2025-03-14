'use client';
import { Badge } from '@/app/_components/ui/badge';
import { useMaterial } from '@/app/_hook/query/useMaterial';
import { useShow } from '@/app/_hook/query/useShow';
import { useCreateTap, useDeleteTap, useEditTap, useGetTap } from '@/app/_hook/query/useTap';
import { useUserTemplate } from '@/app/_hook/query/useTemaplate';
import { genMaterialPreview } from '@/app/_lib/editor/editor';
import type { Board } from '@/app/_types/board';
import type { Show } from '@/app/_types/show';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal, Pencil, Plus, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { useMedia } from 'react-use';
import { z } from 'zod/lib';
import { Response } from '../Comand/Response';
import Edit from '../Comand/RiceEdit/Edit';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
interface FormProps {
  defaultValue?: Show;
  userId: string;
}
const zod = z.object({
  title: z.string({ message: '标题不能为空' }).min(1, '标题不能为空'),
  explanation: z.string({ message: '描述不能为空' }).min(1, '描述不能为空'),
  relativeTheme: z.string({ message: '主题不能为空' }).min(1, '主题不能为空').optional(),
  relativeMaterial: z.string({ message: '素材不能为空' }).min(1, '素材不能为空').optional(),
  tap: z
    .array(z.string({ message: '标签不能为空' }))
    .min(1, '标签不能为空')
    .optional(),
});
const Form = ({ defaultValue, userId }: FormProps) => {
  const router = useRouter();
  // 获取模板
  const { dataUserTemplate, isLoadingUserTemplate } = useUserTemplate();
  // 获取标签
  const { tapData, tapLoading } = useGetTap(userId);
  // 获取素材
  const { data, isLoading } = useMaterial();

  const queryClient = useQueryClient();
  const { createShow, createShowPending } = useShow();
  const { editTap, editTapPending } = useEditTap();
  const editTapRef = useRef<HTMLInputElement | null>(null);
  const { deleteTap, deleteTapPending } = useDeleteTap();
  const { createTap } = useCreateTap();
  const isModal = useMedia('(max-width: 768px)');
  const [open, setOpen] = useState(false);
  const [tapInput, setTapInput] = useState('');
  const [tapOpen, setTapOpen] = useState(false);
  // 关闭弹窗
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const closeRef1 = useRef<HTMLButtonElement | null>(null);

  const responseRef = useRef<{ closeModel: () => void }>({
    closeModel: () => {},
  });
  // 选择标签
  const tapRef = useRef<HTMLButtonElement | null>(null);
  const [preview, setPreview] = useState<Board | null>(null);
  // 选择类型
  const [type, setType] = useState<'template' | 'material'>('template');
  // base64
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof zod>>({
    resolver: zodResolver(zod),
    defaultValues: { ...defaultValue },
  });
  const onSubmit = (datas: z.infer<typeof zod>) => {
    if (isLoadingUserTemplate) return;
    const relativeTheme = dataUserTemplate?.find((item) => item.id === datas.relativeTheme);
    if (type === 'template') {
      if (relativeTheme) {
        return createShow(
          {
            json: {
              content: datas.explanation,
              tap: datas.tap?.join(',') || '',
              relativeTheme: relativeTheme.id,
              title: datas.title,
              type: 'template',
            },
          },
          {
            onSuccess: (data) => {
              toast.success('创建成功');
              router.push(`/board/formue/${data.id}`);
            },
          },
        );
      }
      toast.error('主题不存在');
      return;
    }
    if (type === 'material') {
      if (datas.relativeMaterial) {
        return createShow({
          json: {
            content: datas.explanation,
            tap: datas.tap?.join(',') || '',
            relativeMaterial: datas.relativeMaterial,
            title: datas.title,
            type: 'material',
          },
        });
      }
      toast.error('素材不能为空');
      return;
    }
  };
  const createTapFn = () => {
    if (!tapInput) toast.error('标签不能为空');
    if (tapData?.find((item) => item.tag === tapInput)) toast.error('标签已存在');
    toast.loading('创建中...');
    createTap(
      { json: { tag: tapInput, userId } },
      {
        onSuccess: (data) => {
          toast.dismiss();
          toast.success('创建成功');
          queryClient.invalidateQueries({ queryKey: ['tap', userId] });
          form.setValue('tap', [...(form.getValues('tap') || []), data.tag]);
          setTapInput('');
          closeRef.current?.click();
          closeRef1.current?.click();
        },
        onError: () => {
          toast.error('创建失败');
        },
      },
    );
  };
  return (
    <ScrollArea className="h-[calc(100dvh-100px)]">
      <nav className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-2">分享模板或素材</h2>
        <Button variant="outline" onClick={() => router.push('/board/formue')}>
          返回
        </Button>
      </nav>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="type" className="font-bold mb-2">
            类型
          </Label>
          <Select
            value={type}
            onValueChange={(value) => {
              setType(value as 'template' | 'material');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="template">模板</SelectItem>
              <SelectItem value="material">素材</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="title" className="mb-2 font-bold">
            标题
          </Label>
          <Input {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="text-red-500">{form.formState.errors.title.message}</p>
          )}
        </div>
        {/* 相关链接 */}
        <div>
          <Label htmlFor="relativeTheme" className="flex items-center gap-2 font-bold mb-2">
            <span> 相关 </span>
            {type === 'template' && preview?.image && (
              <div className="flex items-center gap-2">
                <PhotoProvider>
                  <PhotoView src={preview.image}>
                    <Badge variant="outline">预览模板图片</Badge>
                  </PhotoView>
                </PhotoProvider>
              </div>
            )}
            {type === 'material' && previewImage && (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="outline"> 预览 </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="h-[180px]">
                      <Image src={previewImage} fill alt="预览素材图片" className="object-cover" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </Label>
          {type === 'template' && !isLoadingUserTemplate && (
            <Select
              onValueChange={(value) => {
                const fabricData = dataUserTemplate?.find((item) => item.id === value);
                form.setValue('relativeTheme', value);
                setPreview(fabricData as Board);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分享模板" />
              </SelectTrigger>
              <SelectContent>
                {dataUserTemplate?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {type === 'template' && form.formState.errors.relativeTheme && (
            <p className="text-red-500">{form.formState.errors.relativeTheme.message}</p>
          )}
        </div>
        {/* 素材 */}
        {type === 'material' && !isLoading && (
          <div>
            <Select
              onValueChange={async (value) => {
                const fabricData = data?.find((item) => item.id === value);
                form.setValue('relativeMaterial', value);
                const image = await genMaterialPreview(fabricData?.options, 100, 100);
                setPreviewImage(image);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分享素材" />
              </SelectTrigger>
              <SelectContent>
                {data?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {/* 描述 */}
        <div>
          <Label htmlFor="explanation" className="font-bold mb-2">
            描述
          </Label>
          <Edit
            content={defaultValue?.explanation || ''}
            setValue={form.setValue}
            setError={form.setError}
          />
        </div>
        <div className="space-y-4">
          <Label htmlFor="tap" className="text-lg font-medium">
            标签
          </Label>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              {form.getValues('tap')?.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="px-3  py-1.5 text-sm font-medium rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <span className="mr-2">{item}</span>
                  <button
                    type="button"
                    className="hover:text-red-500 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      form.setValue(
                        'tap',
                        form.getValues('tap')?.filter((tag) => tag !== item),
                      );
                    }}
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
              {!tapLoading && (
                <section>
                  {!isModal ? (
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-blue-50">
                          <Plus className="w-4 h-4 text-blue-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>创建标签</DialogTitle>
                          <DialogDescription>添加新的标签以便更好地分类</DialogDescription>
                        </DialogHeader>
                        <DialogClose ref={closeRef} />
                        <div className="space-y-3 py-4">
                          <Input
                            placeholder="请输入标签名称"
                            value={tapInput}
                            onChange={(e) => setTapInput(e.target.value)}
                            className="h-10"
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose ref={closeRef1} asChild>
                            <Button type="button" variant="outline">
                              取消
                            </Button>
                          </DialogClose>
                          <Button type="button" onClick={createTapFn}>
                            创建
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Drawer open={open} onOpenChange={setOpen}>
                      <DrawerTrigger asChild>
                        <Button type="button" variant="outline">
                          <Plus />
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="h-[35dvh]">
                        <DrawerHeader className="text-left">
                          <DrawerTitle>创建标签</DrawerTitle>
                          <DrawerDescription>请输入标签</DrawerDescription>
                        </DrawerHeader>
                        <Input
                          placeholder="请输入标签"
                          value={tapInput}
                          onChange={(e) => setTapInput(e.target.value)}
                        />
                        <DrawerFooter className="pt-2">
                          <DrawerClose ref={closeRef1} asChild>
                            <Button variant="outline">关闭</Button>
                          </DrawerClose>
                          <Button type="button" onClick={createTapFn}>
                            创建
                          </Button>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  )}
                </section>
              )}
            </div>

            <section className="flex gap-2">
              {!tapLoading ? (
                !isModal ? (
                  <Dialog open={tapOpen} onOpenChange={setTapOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" type="button" className="h-10 px-4 gap-2">
                        <span>选择标签</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>选择标签</DialogTitle>
                        <DialogDescription>
                          选择标签后，点击确定按钮，标签将添加到模板中
                        </DialogDescription>
                      </DialogHeader>
                      <DialogClose ref={tapRef} />
                      <ScrollArea className="max-h-[35dvh]">
                        <div className="space-y-1">
                          {tapData?.map((item) => (
                            <section
                              key={item.tag}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group"
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  id={item.tag}
                                  defaultChecked={form.getValues('tap')?.includes(item.tag)}
                                  onCheckedChange={(checked) => {
                                    form.setValue(
                                      'tap',
                                      checked
                                        ? [...(form.getValues('tap') || []), item.tag]
                                        : (form.getValues('tap') || [])?.filter(
                                            (tag) => tag !== item.tag,
                                          ),
                                    );
                                  }}
                                  className="rounded-sm"
                                />
                                <label
                                  htmlFor={item.tag}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {item.tag}
                                </label>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[160px]">
                                  <DropdownMenuItem asChild>
                                    <Response
                                      title="编辑"
                                      description="确定编辑吗？"
                                      ref={responseRef}
                                      disabled={editTapPending}
                                      myTrigger={
                                        <Button
                                          variant="ghost"
                                          className="flex w-full     items-center gap-2"
                                        >
                                          <Pencil />
                                          <span> 编辑 </span>
                                        </Button>
                                      }
                                      onConfirm={() => {
                                        if (!editTapRef.current?.value) {
                                          toast.error('标签不能为空');
                                          return;
                                        }
                                        if (
                                          tapData?.find(
                                            (item) => item.tag === editTapRef.current?.value,
                                          )
                                        ) {
                                          toast.error('标签已存在');
                                          return;
                                        }
                                        editTap(
                                          {
                                            json: {
                                              id: item.id,
                                              tag: editTapRef.current?.value,
                                            },
                                          },
                                          {
                                            onSuccess: () => {
                                              toast.success('编辑成功');
                                              queryClient.invalidateQueries({
                                                queryKey: ['tap', userId],
                                              });
                                              responseRef.current?.closeModel();
                                            },
                                          },
                                        );
                                      }}
                                    >
                                      <span className="flex items-center gap-2">
                                        <Input ref={editTapRef} defaultValue={item.tag} />
                                      </span>
                                    </Response>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Response
                                      title="删除"
                                      disabled={deleteTapPending}
                                      description="确定删除吗？"
                                      ref={responseRef}
                                      onConfirm={() => {
                                        deleteTap(
                                          { json: { id: item.id } },
                                          {
                                            onSuccess: () => {
                                              toast.success('删除成功');
                                              queryClient.invalidateQueries({
                                                queryKey: ['tap', userId],
                                              });
                                              responseRef.current?.closeModel();
                                            },
                                          },
                                        );
                                      }}
                                      myTrigger={
                                        <Button
                                          variant="ghost"
                                          className="flex w-full items-center gap-2"
                                        >
                                          <Trash2 />
                                          <span> 删除 </span>
                                        </Button>
                                      }
                                    />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </section>
                          ))}
                        </div>
                      </ScrollArea>
                      <DialogFooter>
                        <Button type="button" onClick={() => setTapOpen(false)}>
                          确定
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Drawer open={tapOpen} onOpenChange={setTapOpen}>
                    <DrawerTrigger asChild>
                      <Button type="button" variant="outline">
                        选择标签
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader className="text-left">
                        <DrawerTitle>选择标签</DrawerTitle>
                        <DrawerDescription>
                          选择标签后，点击确定按钮，标签将添加到模板中
                        </DrawerDescription>
                      </DrawerHeader>
                      <ScrollArea className="max-h-[35dvh] flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                          {tapData?.map((item) => (
                            <section key={item.tag} className="flex items-center justify-between">
                              <div>
                                <Checkbox
                                  id={item.tag}
                                  defaultChecked={form.getValues('tap')?.includes(item.tag)}
                                  onCheckedChange={(checked) => {
                                    form.setValue(
                                      'tap',
                                      checked
                                        ? [...(form.getValues('tap') || []), item.tag]
                                        : (form.getValues('tap') || [])?.filter(
                                            (tag) => tag !== item.tag,
                                          ),
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={item.tag}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {item.tag}
                                </label>
                              </div>
                              <div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger>
                                    <Button variant="outline" type="button" asChild>
                                      <span>
                                        <MoreHorizontal />
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="flex flex-col gap-2">
                                    <DropdownMenuItem asChild>
                                      <Response
                                        title="编辑"
                                        description="确定编辑吗？"
                                        ref={responseRef}
                                        disabled={editTapPending}
                                        myTrigger={
                                          <Button className="flex w-full items-center gap-2">
                                            <Pencil />
                                            <span> 编辑 </span>
                                          </Button>
                                        }
                                        onConfirm={() => {
                                          if (!editTapRef.current?.value) {
                                            toast.error('标签不能为空');
                                            return;
                                          }
                                          if (
                                            tapData?.find(
                                              (item) => item.tag === editTapRef.current?.value,
                                            )
                                          ) {
                                            toast.error('标签已存在');
                                            return;
                                          }
                                          editTap(
                                            {
                                              json: {
                                                id: item.id,
                                                tag: editTapRef.current?.value,
                                              },
                                            },
                                            {
                                              onSuccess: () => {
                                                toast.success('编辑成功');
                                                queryClient.invalidateQueries({
                                                  queryKey: ['tap', userId],
                                                });
                                                responseRef.current?.closeModel();
                                              },
                                            },
                                          );
                                        }}
                                      >
                                        <span className="flex items-center gap-2">
                                          <Input ref={editTapRef} defaultValue={item.tag} />
                                        </span>
                                      </Response>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Response
                                        title="删除"
                                        disabled={deleteTapPending}
                                        description="确定删除吗？"
                                        ref={responseRef}
                                        onConfirm={() => {
                                          deleteTap(
                                            { json: { id: item.id } },
                                            {
                                              onSuccess: () => {
                                                toast.success('删除成功');
                                                queryClient.invalidateQueries({
                                                  queryKey: ['tap', userId],
                                                });
                                                responseRef.current?.closeModel();
                                              },
                                            },
                                          );
                                        }}
                                        myTrigger={
                                          <Button
                                            variant="ghost"
                                            className="flex w-full items-center gap-2"
                                          >
                                            <Trash2 />
                                            <span> 删除 </span>
                                          </Button>
                                        }
                                      />
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </section>
                          ))}
                        </div>
                      </ScrollArea>
                      <DrawerFooter>
                        <Button type="button" onClick={() => setTapOpen(false)}>
                          确定
                        </Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                )
              ) : (
                <Skeleton className="h-10 w-[100px]" />
              )}
            </section>
          </div>
        </div>
        {form.formState.errors.tap && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.tap.message}</p>
        )}
        {isLoadingUserTemplate || tapLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Button
            type="submit"
            variant="outline"
            disabled={!dataUserTemplate?.length || createShowPending}
          >
            {type === 'template' && (dataUserTemplate?.length ? '创建' : '请先创建模板')}
            {type === 'material' && (data?.length ? '创建' : '请先创建素材')}
          </Button>
        )}
      </form>
    </ScrollArea>
  );
};

export default Form;
