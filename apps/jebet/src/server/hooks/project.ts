import { InferResponseType, InferRequestType } from 'hono';
import { client } from '..';
import { useMutation, useQuery } from '@tanstack/react-query';

type ProjectListType = InferResponseType<typeof client.project.list.$get, 200>;
/**
 *  获取项目列表
 * @param workspaceId 工作区ID
 * @param userId 用户ID
 * @returns
 */
export const useProjectList = (workspaceId: string, userId: string) => {
  const {
    data: projectList,
    isLoading: isLoadingProjectList,
    error: projectListError,
  } = useQuery<ProjectListType, Error, ProjectListType>({
    queryKey: ['projectList', workspaceId],
    queryFn: async () => {
      const res = await client.project.list.$get({
        query: { workspaceId, userId },
      });
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
  const { mutate: createProject, isPending: isCreatingProject } = useMutation<
    ProjectType,
    Error,
    ProjectRequestType
  >({
    mutationFn: async (data) => {
      const res = await client.project.create.$post({
        form: data.form,
      });
      if (!res.ok) throw res.ok;
      return res.json();
    },
  });
  return { createProject, isCreatingProject };
};

type ProjectUpdateType = InferResponseType<
  typeof client.project.update.$patch,
  200
>;
type ProjectUpdateRequestType = InferRequestType<
  typeof client.project.update.$patch
>;
/**
 * 更新项目信息
 */
export const useProjectUpdate = () => {
  const { mutate: updateProject, isPending: isUpdatingProject } = useMutation<
    ProjectUpdateType,
    Error,
    ProjectUpdateRequestType
  >({
    mutationFn: async (data) => {
      const res = await client.project.update.$patch({
        form: data.form,
      });
      if (!res.ok) throw res.ok;
      return res.json();
    },
  });
  return { updateProject, isUpdatingProject };
};

type ProjectDeleteType = InferResponseType<
  typeof client.project.delete.$delete,
  200
>;
type ProjectDeleteRequestType = InferRequestType<
  typeof client.project.delete.$delete
>;
/**
 * 删除项目
 */
export const useProjectDelete = () => {
  const { mutate: deleteProject, isPending: isDeletingProject } = useMutation<
    ProjectDeleteType,
    Error,
    ProjectDeleteRequestType
  >({
    mutationFn: async (data) => {
      const res = await client.project.delete.$delete({
        json: data.json,
      });
      if (!res.ok) throw res.ok;
      return res.json();
    },
  });
  return { deleteProject, isDeletingProject };
};
