import { Button } from '@/app/_components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/app/_components/ui/drawer';
import { cn } from '@/app/_lib/utils';
import { type ReactNode, type RefObject, useImperativeHandle, useState } from 'react';
import { useMediaQuery } from '../../_hook/useMediaQuery';

interface DrawerDialogProps {
  title: string;
  description: string;
  ref: RefObject<{ closeModel: () => void } | null>;
  onConfirm?: () => void | Promise<void>;
  myTrigger?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  showDescription?: boolean;
  showFooter?: boolean;
  variant?: 'default' | 'destructive';
}
/**
 * 弹窗组件
 * @param title 标题
 * @param description 描述
 * @param children 子组件
 * @param onConfirm 确定回调
 * @param ref 引用
 * @param variant 按钮类型
 * @param myTrigger 自定义触发器
 * @param showDescription 是否显示描述
 * @param showFooter 是否显示底部
 * @returns
 * @example 
 *  <Response
      title="新建对话"
      description="新建ai对话"
      disabled={createAiSessionPending}
      ref={responseRef}
      myTrigger={
        <Button variant="outline">
          <Plus className="h-4 w-4" />
          <span>新建对话</span>
        </Button>
      }
      onConfirm={() => {
        createAiSession(
          { json: { name } },
          {
            onSuccess: (data) => {
              queryClient.invalidateQueries({ queryKey: ['aiSessionList'] });
              responseRef.current?.closeModel();
              router.push(`/board/ai/${data.id}`);
            },
          },
        );
      }}
    >
      <Input placeholder="请输入对话名称" value={name} onChange={(e) => setName(e.target.value)} />
    </Response>
 */
export function Response({
  title,
  description,
  children,
  onConfirm,
  ref,
  variant = 'default',
  myTrigger,
  showDescription,
  disabled = false,
  showFooter = true,
}: DrawerDialogProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  useImperativeHandle(ref, () => ({
    closeModel: () => {
      setOpen(false);
    },
  }));
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          asChild
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {myTrigger ? (
            myTrigger
          ) : (
            <Button variant="outline" disabled={disabled}>
              {title}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className={cn(isDesktop ? 'sm:max-w-[425px]' : '')}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription
              className={cn(
                variant === 'destructive' ? 'text-destructive font-bold' : '',
                !showDescription ? 'hidden' : '',
              )}
            >
              {description}
            </DialogDescription>
          </DialogHeader>
          {children}
          {showFooter && (
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <Button onClick={onConfirm} disabled={disabled}>
                确定
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {myTrigger ? myTrigger : <Button variant="outline">{title}</Button>}
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription
            className={cn(
              variant === 'destructive' ? 'text-destructive font-bold' : '',
              !showDescription ? 'hidden' : '',
            )}
          >
            {description}
          </DrawerDescription>
        </DrawerHeader>
        {children}
        {showFooter && (
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">取消</Button>
            </DrawerClose>
            <Button onClick={onConfirm} disabled={disabled}>
              确定
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
