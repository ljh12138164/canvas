import { client } from '@/server';
import { getNewToken } from '@/server/sign';
import { useMutation } from '@tanstack/vue-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'vue-router';

const router = useRouter();

type Folder = InferResponseType<typeof client.folder.create.$post, 200>;
type FolderRequest = InferRequestType<typeof client.folder.create.$post>;
/**
 * 创建文件夹
 * @param tokenb
 */
export const useCreateFolder = () => {
  const { mutate: createFolder, isPending: createFolderIsLoading } = useMutation<Folder, Error, FolderRequest>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.folder.create.$post(data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('创建失败');
      }
      return res.json();
    },
  });
  return { createFolder, createFolderIsLoading };
};
