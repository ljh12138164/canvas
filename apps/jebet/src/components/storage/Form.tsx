import { useCreateStoage, useUpdateStoage } from '@/server/hooks/stoages';
import type { Member, StoageData, Workspace } from '@/types/workspace';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { z } from 'zod';
import { Button } from '../ui/button';
import { DialogClose, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Filelist from './FileList';

interface FormProps {
  userId: string;
  workspace?: Workspace & {
    member: Member[];
  };
  workspaceId?: string;
  type: 'create' | 'update';
  defaultData?: StoageData;
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
const UploadButton = styled(Button)`
  margin-top: 0.5rem;
  height: 3rem;
  width: 100%;
`;
const Form = ({ workspace, workspaceId, type, defaultData }: FormProps) => {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      name: defaultData?.name || '',
      description: defaultData?.description || '',
    },
  });
  const { create, isLoading } = useCreateStoage();
  const { update, updatePending } = useUpdateStoage();
  const queryClient = useQueryClient();
  const close = useRef<HTMLButtonElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  function onSubmit(data: z.infer<typeof zodSchema>) {
    if ((!file || file.size === 0) && !defaultData?.file) {
      toast.error('未选择文件');
      return;
    }
    if (type === 'create') {
      if (!workspace || !file) return;
      return create(
        {
          form: {
            size: file.size.toString(),
            name: data.name,
            description: data.description,
            workspaceId: workspace.id,
            type: file.name.split('.').pop() || '',
            file,
          },
        },
        {
          onSuccess: () => {
            toast.success('上传成功');
            reset();
            setFile(null);
            close.current?.click();
            queryClient.invalidateQueries({
              queryKey: ['stoages', workspace.id],
            });
          },
        },
      );
    }
    if (type === 'update') {
      if (!workspaceId) return;
      if (defaultData?.name === data.name || defaultData?.description === data.description) {
        return update(
          {
            json: {
              id: defaultData?.id || '',
              workspaceId,
              name: data.name,
              description: data.description || '',
            },
          },
          {
            onSuccess() {
              toast.success('保存成功');
              reset();
              setFile(null);
              close.current?.click();
              queryClient.invalidateQueries({
                queryKey: ['stoages', workspaceId],
              });
            },
          },
        );
      }
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
            文件名
          </Label>
          <Input {...register('name')} id="name" placeholder="请输入文件名" className="mt-2" />
          {formState.errors.name && (
            <p className="text-red-500 text-sm">{formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description" id="description">
            文件描述
          </Label>
          <Input
            {...register('description')}
            id="description"
            placeholder="请输入文件描述(选填)"
            className="mt-2"
          />
          {formState.errors.description && (
            <p className="text-red-500 text-sm">{formState.errors.description.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {!file && !defaultData?.file && (
            <UploadButton
              type="button"
              onClick={() => {
                fileRef.current?.click();
              }}
              variant={'outline'}
              className="mt-4"
              id="file"
            >
              选择文件
            </UploadButton>
          )}
          {type === 'create' && (
            <Input
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 50 * 1024 * 1024) {
                    toast({
                      title: '文件过大',
                      description: '文件大小不能超过50M',
                      variant: 'destructive',
                    });
                    return;
                  }
                  setFile(file);
                }
                e.target.value = '';
              }}
              type="file"
              className="hidden"
            />
          )}
          <Filelist setFile={setFile} file={file} />
        </div>
        <DialogClose asChild>
          <Button variant={'outline'} ref={close} className="w-full mt-auto hidden">
            取消
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={!!(!file && !defaultData?.file) || isLoading || updatePending}
          className="w-full mt-auto"
        >
          提交
        </Button>
      </FormContainer>
    </section>
  );
};

export default Form;
