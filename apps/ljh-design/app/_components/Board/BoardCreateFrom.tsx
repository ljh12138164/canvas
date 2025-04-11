import { cn, getTryBoardById, indexDBChange } from '@/app/_lib/utils';
import type { BoardResponse } from '@/app/_types/board';
import { zodResolver } from '@hookform/resolvers/zod';
import { type UseMutateFunction, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import type { RefObject } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
export interface Board {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
  json: string;
  height: number;
  width: number;
}
const typeObj = {
  create: '创建',
  edit: '编辑',
  copy: '复制',
};
const zod = z.object({
  name: z
    .string({ message: '请输入画布名称' })
    .min(2, { message: '画布名称至少为2个字符' })
    .max(20, { message: '画布名称最多为20个字符' }),
  width: z
    .string({ message: '请输入画布宽度' })
    .min(1, { message: '画布宽度最小为1' })
    .max(7, { message: '画布宽度最大为999999' }),
  height: z
    .string({ message: '请输入画布高度' })
    .min(1, { message: '画布高度最小为1' })
    .max(7, { message: '画布高度最大为999999' }),
});
interface BoardCreateFromProps {
  type: 'create' | 'edit' | 'copy';
  children: React.ReactNode;
  defaultValues?: Board;
  userId?: string;
  closeref: RefObject<HTMLButtonElement | null> | RefObject<{ closeModel: () => void } | null>;
  setChange?: (change: boolean) => void;
  mutate:
    | UseMutateFunction<
        BoardResponse,
        Error,
        {
          name: string;
          width: number;
          height: number;
          json?: string;
        }
      >
    | undefined;
  isTemplate?: boolean;
  // 文件地址
  templateData?: {
    image: string;
    json?: string;
  };
  setTemplate?: boolean;
  isClone?: boolean;
}
const BoardCreateFrom = ({
  type,
  children,
  closeref,
  defaultValues,
  userId,
  mutate,
  setChange,
  isTemplate,
  templateData,
  setTemplate,
  isClone,
}: BoardCreateFromProps) => {
  const router = useRouter();
  const query = useQueryClient();
  const { register, handleSubmit, formState } = useForm<z.infer<typeof zod>>({
    resolver: zodResolver(zod),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          width: `${defaultValues.width}`,
          height: `${defaultValues.height}`,
        }
      : {
          name: '',
          width: '700',
          height: '1100',
        },
  });
  const onSubmit = async (data: z.infer<typeof zod>) => {
    // 用户登录
    if (userId) {
      query.invalidateQueries({ queryKey: ['board'] });
      toast.loading(`${typeObj[type]}中...`);
      // 创建
      if (!isClone)
        return mutate?.(
          {
            ...data,
            width: Number(data.width),
            height: Number(data.height),
            // @ts-ignore
            json: type === 'create' ? '' : defaultValues.json,
            ...(isTemplate && {
              image: templateData?.image,
              isTemplate: !!setTemplate,
              json: templateData?.json,
            }),
          },
          {
            onSuccess: (data) => {
              if (!setTemplate) query.invalidateQueries({ queryKey: ['board'] });
              if (setTemplate) query.invalidateQueries({ queryKey: ['templateUser'] });
              toast.dismiss();
              toast.success(type === 'create' ? '创建成功' : '更新成功');
              if (closeref.current && 'click' in closeref.current) {
                closeref.current.click();
              }
              if (closeref.current && 'closeModel' in closeref.current) {
                closeref.current.closeModel();
              }
              if (!setTemplate) router.push(`/Edit/${data.id}`);
              if (setTemplate) router.push(`/EditTemplate/${data.id}`);
            },
            onError: () => {
              toast.dismiss();
              toast.error(type === 'create' ? '创建失败' : '更新失败');
            },
          },
        );
      // 从论坛克隆
      if (isClone) {
        mutate?.({
          ...data,
          width: Number(data.width),
          height: Number(data.height),
        });
        return;
      }
    }
    // 创建
    if (type === 'create') {
      // 创建
      toast.loading('创建中...');
      indexDBChange({
        type: 'add',
        data: {
          ...data,
          id: nanoid(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          json: '',
        },
      });
      if (setChange) setChange(true);
      toast.dismiss();
      toast.success(' ');
      if (closeref.current && 'click' in closeref.current) {
        closeref.current.click();
      }
      if (closeref.current && 'closeModel' in closeref.current) {
        closeref.current.closeModel();
      }
    }
    // 编辑
    if (type === 'edit') {
      toast.loading('修改中...');
      indexDBChange({
        type: 'edit',
        // @ts-ignore
        editData: {
          ...defaultValues,
          ...data,
          updated_at: new Date().toISOString(),
        },
      });
      if (setChange) setChange(true);
      toast.dismiss();
      toast.success('修改成功');
      if (closeref.current && 'click' in closeref.current) {
        closeref.current.click();
      }
      if (closeref.current && 'closeModel' in closeref.current) {
        closeref.current.closeModel();
      }
    }
    // 复制
    if (type === 'copy') {
      toast.dismiss();
      (async () => {
        toast.loading('复制中...');
        // @ts-ignore
        const board = await getTryBoardById(defaultValues.id);
        await indexDBChange({
          type: 'add',
          data: {
            ...board,
            json: board?.json || '',
            id: nanoid(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            name: data.name,
            width: data.width,
            height: data.height,
          },
        });
        if (setChange) setChange(true);
        toast.dismiss();
        toast.success('复制成功');
        if (closeref.current && 'click' in closeref.current) {
          closeref.current.click();
        }
        if (closeref.current && 'closeModel' in closeref.current) {
          closeref.current.closeModel();
        }
      })();
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      data-is-template={isTemplate}
      data-user-id={userId}
      data-testid="board-create-form"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" aria-label="画布名称">
          画布名称
        </Label>
        <Input
          id="name"
          className={cn(formState.errors.name && 'border-red-500')}
          placeholder="请输入画布名称"
          {...register('name')}
        />
        <span
          className={cn(
            'transition-all duration-300 text-sm h-0 ml-2 text-red-500/70 font-[500]',
            formState.errors.name && 'h-4',
          )}
        >
          {formState.errors.name?.message}
        </span>
      </div>
      <section className="flex gap-2 ">
        <div className="flex flex-col gap-2 flex-1">
          <Label htmlFor="width" aria-label="画布宽度">
            画布宽度
          </Label>
          <Input
            className={cn(formState.errors.width && 'border-red-500')}
            id="width"
            placeholder="请输入画布宽度"
            type="number"
            {...register('width')}
          />
          <span
            className={cn(
              'transition-all duration-300 text-sm h-0 ml-2 text-red-500/70 font-[500]',
              formState.errors.width && 'h-4',
            )}
          >
            {formState.errors.width?.message}
          </span>
        </div>
        <div className="flex flex-col gap-2  flex-1">
          <Label htmlFor="height" aria-label="画布高度">
            画布高度
          </Label>
          <Input
            className={cn(formState.errors.height && 'border-red-500')}
            id="height"
            placeholder="请输入画布高度"
            type="number"
            {...register('height')}
          />
          <span
            className={cn(
              'transition-all duration-300 text-sm h-0 ml-2 text-red-500/70 font-[500]',
              formState.errors.height && 'h-4',
            )}
          >
            {formState.errors.height?.message}
          </span>
        </div>
      </section>
      <footer>{children}</footer>
    </form>
  );
};

export default BoardCreateFrom;
