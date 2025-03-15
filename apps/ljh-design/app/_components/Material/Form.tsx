import { useCreateMaterial, useMaterial } from '@/app/_hook/query/useMaterial';
import { useEditMaterial } from '@/app/_hook/query/useMaterial';
import { saveMaterial } from '@/app/_lib/editor/editor';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import type * as Fabric from 'fabric';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
export const zodSchema = z.object({
  name: z.string().min(1),
});
interface FormProps {
  children: ReactNode;
  selectedObject?: Fabric.Group;
  defaultValues?: {
    id: string;
    created_at: string;
    options: string;
    userId: string;
    name: string;
  };
  onSuccess?: () => void;
  type?: 'edit' | 'create';
}
export const Form = ({
  children,
  selectedObject,
  onSuccess,
  type = 'create',
  defaultValues,
}: FormProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<z.infer<typeof zodSchema>>({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      name: defaultValues?.name || '',
    },
  });
  const { data: meteralData, isLoading } = useMaterial();
  const { mutate } = useCreateMaterial();
  const { mutate: editMaterial } = useEditMaterial();
  const onSubmit = useMemoizedFn(async (data: z.infer<typeof zodSchema>) => {
    if (type === 'create') {
      if (isLoading || meteralData === undefined) return;
      const { json, id } = saveMaterial(selectedObject!);
      if (meteralData.map((item) => item.id).includes(id)) {
        toast.error('素材已存在');
        return;
      }
      toast.loading('保存中...');
      return mutate(
        { json: { material: json.json, name: data.name, id } },
        {
          onSuccess: () => {
            toast.dismiss();
            toast.success('保存成功,请前往素材查看');
            queryClient.invalidateQueries({ queryKey: ['material'] });
            onSuccess?.();
          },
        },
      );
    }
    if (type === 'edit') {
      if (isLoading || meteralData === undefined) return;
      toast.loading('编辑中...');
      return editMaterial(
        {
          json: { name: data.name, id: defaultValues?.id! },
        },
        {
          onSuccess: () => {
            toast.dismiss();
            toast.success('编辑成功');
            queryClient.invalidateQueries({ queryKey: ['material'] });
            onSuccess?.();
          },
        },
      );
    }
    return;
    // console.log(data, selectedObject.groupArr);
    // console.log(json);
    // editor?.addMaterial(json.json);
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label>素材名称</Label>
      <Input {...register('name')} />
      {children}
    </form>
  );
};
