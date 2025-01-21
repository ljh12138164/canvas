import { client } from '@/server';
import { getNewToken } from '@/server/sign';
import { useQuery } from '@tanstack/vue-query';
import type { InferResponseType } from 'hono';
import { useRouter } from 'vue-router';
type Folders = InferResponseType<(typeof client.folder.folderList)['$get'], 200>;
const router = useRouter();
export const useBoard = ({ workspaceId }: { workspaceId: string }) => {
  const {
    data: folders,
    error: foldersError,
    isLoading: foldersIsLoading,
  } = useQuery<Folders, Error>({
    queryKey: ['folders', workspaceId],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.folder.folderList.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('获取数据失败');
      }
      return res.json();
    },
  });
  return { folders, foldersError, foldersIsLoading };
};
