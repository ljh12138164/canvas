import type { Edit } from '@/app/_types/Edit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemoizedFn } from 'ahooks';
import type * as Fabric from 'fabric';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
export const zodSchema = z.object({
  name: z.string().min(1),
});
interface FormProps {
  children: ReactNode;
  selectedObject: Fabric.Group;
  editor: Edit | undefined;
}
export const Form = ({ children, selectedObject, editor }: FormProps) => {
  const { register, handleSubmit } = useForm<z.infer<typeof zodSchema>>({
    resolver: zodResolver(zodSchema),
  });

  const onSubmit = useMemoizedFn(async (data: z.infer<typeof zodSchema>) => {
    // console.log(data, selectedObject.groupArr);
    editor?.addMaterial(selectedObject.groupArr as Fabric.Object[]);
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label>素材名称</Label>
      <Input {...register('name')} />
      {children}
    </form>
  );
};
