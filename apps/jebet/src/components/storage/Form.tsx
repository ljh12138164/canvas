import { useCreateStoage } from '@/server/hooks/stoages';
import { Member, Workspace } from '@/types/workspace';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ParsedFormValue } from 'hono/types';

interface FormProps {
  userId: string;
  workspace: Workspace & {
    member: Member[];
  };
}
const zodSchema = z.object({
  name: z.string().min(1, { message: '文件名不能为空' }),
  type: z.string(),
  description: z.string().optional(),
  file: z.instanceof(File),
  size: z.number(),
});
const Form = ({ userId, workspace }: FormProps) => {
  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
      file: new File([], ''),
      size: 0,
    },
  });
  const { create, isLoading, error } = useCreateStoage();
  function onSubmit(data: z.infer<typeof zodSchema>) {
    create({
      form: {
        name: data.name,
        type: data.type,
        description: data.description,
        workspaceId: workspace.id,
        userId,
        file: data.file,
        size: data.size,
      },
    });
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} />
      <Input {...register('type')} />
      <Input {...register('description')} />
      <Input
        {...register('file')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setValue('size', file.size);
          }
        }}
        type='file'
        hidden
      />

      <Button type='submit'>提交</Button>
    </form>
  );
};

export default Form;
