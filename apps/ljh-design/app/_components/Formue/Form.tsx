'use client';
import { Badge } from '@/app/_components/ui/badge';
import { useBoardListQuery } from '@/app/_hook/query/useBoardQuery';
import { useCreateTap, useGetTap } from '@/app/_hook/query/useTap';
import type { Board } from '@/app/_types/board';
import type { Show } from '@/app/_types/show';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMedia } from 'react-use';
import { z } from 'zod';
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
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
interface FormProps {
  defaultValue?: Show;
  userId: string;
}
const Form = ({ defaultValue, userId }: FormProps) => {
  // 获取模板
  const { data, isLoading } = useBoardListQuery();
  // 获取标签
  const { tapData, tapLoading } = useGetTap(userId);
  const queryClient = useQueryClient();
  const { createTap } = useCreateTap();
  const isModal = useMedia('(max-width: 768px)');
  const [open, setOpen] = useState(false);
  const [tapInput, setTapInput] = useState('');
  const [tapOpen, setTapOpen] = useState(false);
  // 关闭弹窗
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const closeRef1 = useRef<HTMLButtonElement | null>(null);
  // 选择标签
  const tapRef = useRef<HTMLButtonElement | null>(null);
  const tapRef1 = useRef<HTMLButtonElement | null>(null);
  const [preview, setPreview] = useState<Board | null>(null);
  const zod = z.object({
    title: z.string({ message: '标题不能为空' }).min(1, '标题不能为空'),
    explanation: z.string({ message: '描述不能为空' }).min(1, '描述不能为空'),
    relativeTheme: z.string({ message: '主题不能为空' }).min(1, '主题不能为空'),
    tap: z
      .array(z.string({ message: '标签不能为空' }))
      .min(1, '标签不能为空')
      .optional(),
  });
  const form = useForm<z.infer<typeof zod>>({
    resolver: zodResolver(zod),
    defaultValues: defaultValue,
  });
  const onSubmit = (datas: z.infer<typeof zod>) => {
    if (isLoading) return;
    if (data?.length) {
      // TODO:提交
    }
  };
  const createTapFn = () => {
    if (!tapInput) toast.error('标签不能为空');
    if (tapData?.find((item) => item.tag === tapInput)) toast.error('标签已存在');
    createTap(
      { json: { tag: tapInput, userId } },
      {
        onSuccess: () => {
          toast.success('创建成功');
          queryClient.invalidateQueries({ queryKey: ['tap', userId] });
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
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="title"> 标题 </Label>
          <Input {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="text-red-500">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="relativeTheme" className="flex items-center gap-2">
            <span> 主题 </span>
            {preview?.image && (
              <div className="flex items-center gap-2">
                <PhotoProvider>
                  <PhotoView src={preview.image}>
                    <Badge variant="outline">预览模板图片</Badge>
                  </PhotoView>
                </PhotoProvider>
              </div>
            )}
          </Label>
          {!isLoading ? (
            <Select
              onValueChange={(value) => {
                const fabricData = data?.find((item) => item.id === value);
                form.setValue('relativeTheme', value);
                setPreview(fabricData as Board);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分享模板" />
              </SelectTrigger>
              <SelectContent>
                {data?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Skeleton className="h-10 w-full" />
          )}
          {form.formState.errors.relativeTheme && (
            <p className="text-red-500">{form.formState.errors.relativeTheme.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="explanation"> 描述 </Label>
          <Edit
            content={defaultValue?.explanation || ''}
            setValue={form.setValue}
            setError={form.setError}
          />
        </div>
        <div>
          <Label htmlFor="tap"> 标签 </Label>
          <div className="flex items-center gap-2">
            <div>已选择</div>
            <div className="flex flex-wrap gap-2">
              {form.getValues('tap')?.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          {!tapLoading ? (
            !isModal ? (
              <section>
                <Dialog open={tapOpen} onOpenChange={setTapOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button" onClick={() => {}}>
                      选择标签
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>选择标签</DialogTitle>
                      <DialogDescription>
                        选择标签后，点击确定按钮，标签将添加到模板中
                      </DialogDescription>
                    </DialogHeader>
                    <DialogClose ref={tapRef} />
                    <ScrollArea className="max-h-[35dvh] flex flex-col gap-2">
                      {tapData?.map((item) => (
                        <div key={item.tag} className="flex items-center gap-2">
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
                      ))}
                    </ScrollArea>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" onClick={() => {}}>
                          确定
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </section>
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
                    {tapData?.map((item) => (
                      <div key={item.tag} className="flex items-center gap-2">
                        <Checkbox
                          id={item.tag}
                          defaultChecked={form.getValues('tap')?.includes(item.tag)}
                          onCheckedChange={(checked) => {
                            form.setValue(
                              'tap',
                              checked
                                ? [...(form.getValues('tap') || []), item.tag]
                                : (form.getValues('tap') || [])?.filter((tag) => tag !== item.tag),
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
                    ))}
                  </ScrollArea>
                </DrawerContent>
              </Drawer>
            )
          ) : (
            <Skeleton className="h-10 w-full" />
          )}

          {!tapLoading && (
            <section>
              {!isModal ? (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button" onClick={() => {}}>
                      创建标签
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>创建标签</DialogTitle>
                      <DialogDescription>请输入标签</DialogDescription>
                    </DialogHeader>
                    <DialogClose ref={closeRef} />
                    <Input
                      placeholder="请输入标签"
                      value={tapInput}
                      onChange={(e) => setTapInput(e.target.value)}
                    />
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
                      创建标签
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
        {form.formState.errors.tap && (
          <p className="text-red-500">{form.formState.errors.tap.message}</p>
        )}
        {isLoading || tapLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Button type="submit" variant="outline" disabled={!data?.length}>
            {data?.length ? '创建' : '请先创建模板'}
          </Button>
        )}
      </form>
    </ScrollArea>
  );
};

export default Form;
