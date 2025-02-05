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
import { type ReactNode, type RefObject, useImperativeHandle, useState } from 'react';
import { useMediaQuery } from '../../_hook/useMediaQuery';

interface DrawerDialogProps {
  title: string;
  description: string;
  ref: RefObject<{ closeModel: () => void } | null>;
  onConfirm: () => void;
  myTrigger?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  showFooter?: boolean;
}
/**
 * 弹窗组件
 * @param title 标题
 * @param description 描述
 * @param children 子组件
 * @param onConfirm 确定回调
 * @param ref 引用
 * @returns
 * @example 
 * <Response
     title="编辑"
     description="确定编辑吗？"
 *   ref={responseRef}
 *   onConfirm={() => {
 *   console.log('编辑');
 *   responseRef.current?.closeModel();
 *   }}
 *  >
 *  <span className="flex items-center gap-2">
 *     <Pencil />
 *     <span> 编辑 </span>
 *  </span>
 * </Response>
 */
export function Response({
  title,
  description,
  children,
  onConfirm,
  ref,
  myTrigger,
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
        <DialogTrigger asChild>
          {myTrigger ? myTrigger : <Button variant="outline">{title}</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
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
          <DrawerDescription>{description}</DrawerDescription>
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
