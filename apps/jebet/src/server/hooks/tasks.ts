import { client } from '@/server';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useNavigate } from 'react-router-dom';
import { getNewToken } from '../../lib/sign';

type CreateTaskInput = InferRequestType<typeof client.task.create.$post>;
type CreateTaskOutput = InferResponseType<typeof client.task.create.$post, 200>;
/**
 * ## 生成task
 *
 */
export const useCreateTask = () => {
  const navigate = useNavigate();
  const { mutate: createTask, isPending: createTaskLoading } = useMutation<
    CreateTaskOutput,
    Error,
    CreateTaskInput
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.task.create.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('创建任务失败');
      }
      return res.json();
    },
  });
  return { createTask, createTaskLoading };
};

type GetTaskListInput = InferRequestType<typeof client.task.get.$get>['query'];
type GetTaskListOutput = InferResponseType<typeof client.task.get.$get, 200>;
/**
 * ## 获取任务列表
 *
 */
export const useGetTaskList = ({
  workspaceId,
  projectId,
  status,
  search,
  lastTime,
  assigneeId,
}: GetTaskListInput) => {
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useQuery<GetTaskListOutput, Error, GetTaskListOutput>({
    queryKey: ['taskList', workspaceId, projectId],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.task.get.$get(
        {
          query: {
            workspaceId: workspaceId,
            projectId: projectId,
            status: status,
            search: search,
            lastTime: lastTime,
            assigneeId: assigneeId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error('获取任务列表失败');
      }
      return res.json();
    },
  });
  return { data, isLoading, isFetching };
};

type DeleteTaskInput = InferRequestType<typeof client.task.delete.$delete>;
type DeleteTaskOutput = InferResponseType<typeof client.task.delete.$delete, 200>;
/**
 * ## 删除任务
 */
export const useDeleteTask = () => {
  const navigate = useNavigate();
  const { mutate: deleteTask, isPending: deleteTaskLoading } = useMutation<
    DeleteTaskOutput,
    Error,
    DeleteTaskInput
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.task.delete.$delete(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('删除任务失败');
      }
      return res.json();
    },
  });
  return { deleteTask, deleteTaskLoading };
};

type UpdateTaskInput = InferRequestType<typeof client.task.update.$patch>;
type UpdateTaskOutput = InferResponseType<typeof client.task.update.$patch, 200>;
/**
 * ## 更新任务
 */
export const useUpdateTask = () => {
  const navigate = useNavigate();
  const { mutate: updateTask, isPending: updateTaskLoading } = useMutation<
    UpdateTaskOutput,
    Error,
    UpdateTaskInput
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.task.update.$patch(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('更新任务失败');
      }
      return res.json();
    },
  });
  return { updateTask, updateTaskLoading };
};

type GetTaskDetailOutput = InferResponseType<typeof client.task.detail.$get, 200>;
/**
 * ## 获取任务详情
 */
export const useGetTaskDetail = (workspaceId: string, projectId: string, id: string) => {
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useQuery<GetTaskDetailOutput, Error>({
    queryKey: ['taskDetail', workspaceId, projectId, id],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.task.detail.$get(
        {
          query: {
            workspaceId: workspaceId,
            projectId: projectId,
            id: id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error('获取任务详情失败');
      return res.json();
    },
  });
  return { data, isLoading, isFetching };
};

type CreateTaskRemarkInput = InferRequestType<typeof client.task.addRemark.$post>;
type CreateTaskRemarkOutput = InferResponseType<typeof client.task.addRemark.$post, 200>;
/**
 * ### 创建任务评论
 */
export const useCreateTaskRemark = () => {
  const navigate = useNavigate();
  const { mutate: createTaskRemark, isPending: createTaskRemarkLoading } = useMutation<
    CreateTaskRemarkOutput,
    Error,
    CreateTaskRemarkInput
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.task.addRemark.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('创建任务评论失败');
      return res.json();
    },
  });
  return { createTaskRemark, createTaskRemarkLoading };
};

type MoveTaskInput = InferRequestType<typeof client.task.move.$post>;
type MoveTaskOutput = InferResponseType<typeof client.task.move.$post, 200>;
/**
 * ## 移动任务
 */
export const useMoveTask = () => {
  const navigate = useNavigate();
  const { mutate: moveTask, isPending: moveTaskLoading } = useMutation<
    MoveTaskOutput,
    Error,
    MoveTaskInput
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.task.move.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('移动任务失败');
      return res.json();
    },
  });
  return { moveTask, moveTaskLoading };
};
