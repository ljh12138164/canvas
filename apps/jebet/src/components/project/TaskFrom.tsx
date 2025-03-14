import { useCreateTask, useUpdateTask } from '@/server/hooks/tasks';
import { type Member, type Task, TaskStatus } from '@/types/workspace';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { z } from 'zod/lib';
import { TasksPriority } from '../../types/workspace';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { CardContent, CardFooter } from '../ui/card';
import { DialogClose } from '../ui/dialog';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scrollArea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

const zShema = z.object({
  name: z
    .string({
      message: '请输入任务名称',
    })
    .min(2, { message: '任务名称至少2个字符' })
    .max(20, { message: '任务名称最多20个字符' }),
  lastTime: z.any({
    message: '请选择最后时间',
  }),
  assigneeId: z
    .string({
      message: '请选择指派人',
    })
    .min(1, { message: '请选择指派人' }),
  priority: z.nativeEnum(TasksPriority),
  description: z
    .string({
      message: '请输入任务描述',
    })
    .optional(),
  status: z.nativeEnum(TaskStatus),
});
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;
const FromItem = styled.div`
  margin-bottom: 1rem;
`;
const SelectContents = styled.section`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const TaskFrom = ({
  workspaceId,
  projectId,
  type,
  userData,
  isMobile,
  defaultData,
}: {
  workspaceId: string;
  projectId: string;
  type: 'create' | 'edit';
  userData: Member[] | undefined;
  isMobile: boolean;
  defaultData?: Task;
}) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, formState } = useForm<z.infer<typeof zShema>>({
    resolver: zodResolver(zShema),
    defaultValues: {
      name: defaultData?.name || '',
      description: defaultData?.description || '',
      status: defaultData?.status || TaskStatus.TODO,
      assigneeId: defaultData?.assigneeId || '',
      lastTime: defaultData?.lastTime || null,
      priority: defaultData?.priority || TasksPriority.GENERAL,
    },
  });
  const [lastTime, setLastTime] = useState<Date | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeRef2 = useRef<HTMLButtonElement>(null);
  const { createTask, createTaskLoading } = useCreateTask();
  const { updateTask, updateTaskLoading } = useUpdateTask();
  const onSubmit = (data: z.infer<typeof zShema>) => {
    if (type === 'create') {
      toast.loading('创建中');
      createTask(
        {
          // @ts-ignore
          json: {
            ...data,
            workspaceId,
            projectId,
            // lastTime,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['taskList', workspaceId, projectId],
            });
            if (closeRef.current) closeRef.current.click();
            if (closeRef2.current) closeRef2.current.click();
            toast.dismiss();
            toast.success('创建成功');
          },
        },
      );
    }
    if (type === 'edit') {
      updateTask(
        {
          // @ts-ignore
          json: {
            ...data,
            id: defaultData?.id || '',
            workspaceId,
            projectId,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['taskList', workspaceId, projectId],
            });
            toast.dismiss();
            toast.success('更新成功');
            if (closeRef.current) closeRef.current.click();
            if (closeRef2.current) closeRef2.current.click();
          },
        },
      );
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="my-2 flex w-full flex-col gap-2 mx-0">
        <ScrollArea className="h-[calc(100vh-250px)]" style={{ scrollbarWidth: 'none' }}>
          <FromItem>
            <Label htmlFor="name">任务名称</Label>
            <Input id="name" {...register('name')} placeholder="请输入任务名称" />
            <p className="text-red-500 text-sm">{formState.errors.name?.message}</p>
          </FromItem>
          <FromItem>
            <Label htmlFor="status">任务状态</Label>
            <Select
              {...register('status')}
              defaultValue={defaultData?.status || TaskStatus.TODO}
              onValueChange={(value) => {
                setValue('status', value as TaskStatus);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择任务状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskStatus.BACKLOG}>阻塞</SelectItem>
                <SelectItem value={TaskStatus.TODO}>未开始</SelectItem>
                <SelectItem value={TaskStatus.IN_PROGRESS}>进行中</SelectItem>
                <SelectItem value={TaskStatus.IN_REVIEW}>审核中</SelectItem>
                <SelectItem value={TaskStatus.DONE}>已完成</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-red-500 text-sm">{formState.errors.status?.message}</p>
          </FromItem>
          <FromItem>
            <Label htmlFor="lastTime">最后时间</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  {lastTime ? format(lastTime, 'yyyy-MM-dd') : '请选择最后时间'}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  className="w-full"
                  selected={lastTime || undefined}
                  onSelect={(date) => {
                    if (date) {
                      // @ts-ignore
                      setValue('lastTime', date);
                      setLastTime(date);
                    }
                  }}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <p className="text-red-500 text-sm">
              {/* @ts-ignore */}
              {formState.errors.lastTime?.message}
            </p>
          </FromItem>
          <FromItem>
            <Label htmlFor="assigneeId">指派人</Label>
            <Select
              defaultValue={defaultData?.assigneeId || ''}
              {...register('assigneeId')}
              onValueChange={(value) => {
                setValue('assigneeId', value);
              }}
            >
              <SelectTrigger className="h-16 dark:hover:bg-slate-900 hover:bg-slate-100 transition-all duration-200">
                <SelectValue placeholder="选择指派人" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {userData?.map((item) => (
                    <SelectItem
                      className="cursor-pointer flex items-center gap-2"
                      key={item.id}
                      value={item.userId}
                    >
                      <SelectContents>
                        <img
                          className="w-8 h-8 rounded-full"
                          src={item.userImage}
                          alt={item.username}
                        />
                        <p>{item.username}</p>
                      </SelectContents>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-red-500 text-sm">{formState.errors.assigneeId?.message}</p>
          </FromItem>
          <FromItem>
            <Label htmlFor="priority">优先级</Label>
            <Select
              {...register('priority')}
              defaultValue={defaultData?.priority || TasksPriority.GENERAL}
              onValueChange={(value) => {
                setValue('priority', value as TasksPriority);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择优先级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TasksPriority.SUGGESTION}>建议</SelectItem>
                <SelectItem value={TasksPriority.GENERAL}>一般</SelectItem>
                <SelectItem value={TasksPriority.IMPORTANT}>重要</SelectItem>
                <SelectItem value={TasksPriority.URGENT}>紧急</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-red-500 text-sm">{formState.errors.priority?.message}</p>
          </FromItem>
          <FromItem>
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              {...register('description')}
              defaultValue={defaultData?.description}
            />
            <p className="text-red-500 text-sm">{formState.errors.description?.message}</p>
          </FromItem>
        </ScrollArea>
        <CardFooter className="flex w-full flex-col gap-2">
          {!isMobile ? (
            <>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full" ref={closeRef2}>
                  取消
                </Button>
              </DialogClose>
              <Button
                className="w-full"
                type="submit"
                disabled={createTaskLoading || updateTaskLoading}
              >
                {type === 'create' ? '添加' : '保存'}
              </Button>
            </>
          ) : (
            <>
              <DialogClose asChild>
                <Button variant="outline" className="w-full" ref={closeRef}>
                  取消
                </Button>
              </DialogClose>
              <Button className="w-full" type="submit" disabled={createTaskLoading}>
                {type === 'create' ? '添加' : '保存'}
              </Button>
            </>
          )}
        </CardFooter>
      </CardContent>
    </form>
  );
};

export default TaskFrom;
