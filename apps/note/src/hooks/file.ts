import { client } from '@/server';
import { getNewToken } from '@/server/sign';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'vue-router';

const router = useRouter();

type CreateFilesResponse = InferResponseType<(typeof client.file.createFile)['$post'], 200>;
type CreateFilesRequest = InferRequestType<typeof client.file.createFile.$post>;

export const createFiles = () => {
  const { mutate: createFile, isPending: createFileIsPending } = useMutation<
    CreateFilesResponse,
    Error,
    CreateFilesRequest
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.file.createFile.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return res.json();
    },
  });
  return { createFile, createFileIsPending };
};

type UpdateFilesResponse = InferResponseType<(typeof client.file.update)['$patch'], 200>;
type UpdateFilesRequest = InferRequestType<typeof client.file.update.$patch>;
/**
 * ### 更新文件
 * @param data 数据
 * @returns
 */
export const updateFiles = () => {
  const { mutate: updateFile, isPending: updateFileIsPending } = useMutation<
    UpdateFilesResponse,
    Error,
    UpdateFilesRequest
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.file.update.$patch(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return res.json();
    },
  });
  return { updateFile, updateFileIsPending };
};

type GetFileTrashResponse = InferResponseType<(typeof client.file.trash)['$get'], 200>;
/**
 * ### 获取文件垃圾桶
 * @param workspaceId 工作区id
 * @param type 类型
 * @returns
 */
export const useGetFileTrash = (workspaceId: string, type: 'folder' | 'file') => {
  const { data: fileTrash, isLoading: fileTrashIsLoading } = useQuery<
    GetFileTrashResponse,
    Error,
    GetFileTrashResponse
  >({
    queryKey: ['fileTrash'],
    enabled: type === 'file',
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.file.trash.$get(
        {
          query: {
            workspaceId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return res.json();
    },
  });
  return { fileTrash, fileTrashIsLoading };
};

type RestoreFileResponse = InferResponseType<(typeof client.file.restore)['$patch'], 200>;
type RestoreFileRequest = InferRequestType<typeof client.file.restore.$patch>;
/**
 * ### 恢复文件
 * @param data 数据
 * @returns
 */
export const useRestoreFile = () => {
  const { mutate: restoreFile, isPending: restoreFileIsPending } = useMutation<
    RestoreFileResponse,
    Error,
    RestoreFileRequest
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.file.restore.$patch(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return res.json();
    },
  });
  return { restoreFile, restoreFileIsPending };
};

type SoftDeleteFileResponse = InferResponseType<(typeof client.file.delete)['$delete'], 200>;
type SoftDeleteFileRequest = InferRequestType<typeof client.file.delete.$delete>;
/**
 * ### 软删除文件
 * @param data 数据
 * @returns
 */
export const useSoftDeleteFile = () => {
  const { mutate: softDeleteFile, isPending: softDeleteFileIsPending } = useMutation<
    SoftDeleteFileResponse,
    Error,
    SoftDeleteFileRequest
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.file.delete.$delete(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return res.json();
    },
  });
  return { softDeleteFile, softDeleteFileIsPending };
};

type DeleteFileResponse = InferResponseType<(typeof client.file.delete)['$delete'], 200>;
type DeleteFileRequest = InferRequestType<typeof client.file.delete.$delete>;
/**
 * ### 删除文件
 * @param data 数据
 * @returns
 */
export const useDeleteFile = () => {
  const { mutate: deleteFile, isPending: deleteFileIsPending } = useMutation<
    DeleteFileResponse,
    Error,
    DeleteFileRequest
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.file.delete.$delete(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = (await res.json()) as { message: string };
        throw new Error(error.message);
      }
      return res.json();
    },
  });
  return { deleteFile, deleteFileIsPending };
};
