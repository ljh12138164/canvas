import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useNavigate } from 'react-router-dom';
import { client } from '..';
import { getNewToken } from '../../lib/sign';
type ProjectListType = InferResponseType<typeof client.project.list.$get, 200>;
/**
 *  获取项目列表
 * @param workspaceId 工作区ID
 * @param userId 用户ID
 * @returns
 */
export const useProjectList = (workspaceId: string) => {
  const navigate = useNavigate();
  const {
    data: projectList,
    isLoading: isLoadingProjectList,
    error: projectListError,
  } = useQuery<ProjectListType, Error, ProjectListType>({
    queryKey: ['projectList', workspaceId],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.project.list.$get(
        {
          query: { workspaceId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });
  return { projectList, isLoadingProjectList, projectListError };
};

type ProjectType = InferResponseType<typeof client.project.create.$post, 200>;
type ProjectRequestType = InferRequestType<typeof client.project.create.$post>;
/**
 * 创建项目信息
 */
export const useProjectCreate = () => {
  const navigate = useNavigate();
  const { mutate: createProject, isPending: isCreatingProject } = useMutation<
    ProjectType,
    Error,
    ProjectRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.project.create.$post(
        {
          form: data.form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw res.ok;
      return res.json();
    },
  });
  return { createProject, isCreatingProject };
};

type ProjectUpdateType = InferResponseType<typeof client.project.update.$patch, 200>;
type ProjectUpdateRequestType = InferRequestType<typeof client.project.update.$patch>;
/**
 * 更新项目信息
 */
export const useProjectUpdate = () => {
  const navigate = useNavigate();
  const { mutate: updateProject, isPending: isUpdatingProject } = useMutation<
    ProjectUpdateType,
    Error,
    ProjectUpdateRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.project.update.$patch(
        {
          form: data.form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw res.ok;
      return res.json();
    },
  });
  return { updateProject, isUpdatingProject };
};

type ProjectDeleteType = InferResponseType<typeof client.project.delete.$delete, 200>;
type ProjectDeleteRequestType = InferRequestType<typeof client.project.delete.$delete>;
/**
 * 删除项目
 */
export const useProjectDelete = () => {
  const navigate = useNavigate();
  const { mutate: deleteProject, isPending: isDeletingProject } = useMutation<
    ProjectDeleteType,
    Error,
    ProjectDeleteRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) navigate('/sign-in');
      const res = await client.project.delete.$delete(
        {
          json: data.json,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw res.ok;
      return res.json();
    },
  });
  return { deleteProject, isDeletingProject };
};
