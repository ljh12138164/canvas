import { useCreateFlow, useUpdateFlow } from '@/server/hooks/flow';
import type { Flow, Member, Workspace } from '@/types/workspace';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { z } from 'zod';
import { Button } from '../ui/button';
import { DialogClose, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface FormProps {
  userId: string;
  workspace?: Workspace & {
    member: Member[];
  };
  workspaceId?: string;
  type: 'create' | 'update';
  defaultData?: Flow;
}
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const zodSchema = z.object({
  name: z.string().min(1, { message: '文件名不能为空' }),
  description: z.string().optional(),
});

const Form = ({ userId, workspace, workspaceId, type, defaultData }: FormProps) => {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      name: defaultData?.name || '',
      description: defaultData?.description || '',
    },
  });
  const queryClient = useQueryClient();
  const { create, isLoading } = useCreateFlow();
  const { update, updatePending } = useUpdateFlow();
  const close = useRef<HTMLButtonElement>(null);
  function onSubmit(data: z.infer<typeof zodSchema>) {
    if (type === 'create') {
      if (!workspace) return;
      create(
        {
          form: {
            name: data.name,
            description: data.description,
            workspaceId: workspace.id,
            userId: userId,
          },
        },
        {
          onSuccess: () => {
            toast.success('创建成功');
            queryClient.invalidateQueries({ queryKey: ['flow', workspaceId] });
          },
          onError: () => {
            toast.error('创建失败');
          },
        },
      );
    }
    if (type === 'update') {
      if (!workspaceId) return;
      update(
        {
          json: {
            name: data.name,
            description: data.description || '',
            workspaceId: workspaceId,
            userId: userId,
            id: defaultData?.id || '',
          },
        },
        {
          onSuccess: () => {
            toast.success('更新成功');
            queryClient.invalidateQueries({ queryKey: ['flow', workspaceId] });
          },
          onError: () => {
            toast.error('更新失败');
          },
        },
      );
    }
  }
  return (
    <section className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">
          {type === 'create' ? '创建文件' : '更新文件'}
        </DialogTitle>
      </DialogHeader>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="name" id="name">
            工作流名称
          </Label>
          <Input {...register('name')} id="name" placeholder="请输入工作流名称" className="mt-2" />
          {formState.errors.name && (
            <p className="text-red-500 text-sm">{formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="description" id="description">
            工作流描述
          </Label>
          <Input
            {...register('description')}
            id="description"
            placeholder="请输入工作流描述(选填)"
            className="mt-2"
          />
          {formState.errors.description && (
            <p className="text-red-500 text-sm">{formState.errors.description.message}</p>
          )}
        </div>
        <DialogClose asChild>
          <Button variant={'outline'} ref={close} className="w-full mt-auto hidden">
            取消
          </Button>
        </DialogClose>
        <Button type="submit" className="w-full mt-auto" disabled={isLoading || updatePending}>
          提交
        </Button>
      </FormContainer>
    </section>
  );
};

export default Form;
