import { client } from '@/server';
import { useQuery } from '@tanstack/vue-query';
import type { InferResponseType } from 'hono';
type Folders = InferResponseType<
  (typeof client.folder.folderList)['$get'],
  200
>;

export const useBoard = (token: string) => {
  const {
    data: folders,
    error: foldersError,
    isLoading: foldersIsLoading,
  } = useQuery<Folders, Error>({
    queryKey: ['folders'],
    queryFn: async () => {
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
