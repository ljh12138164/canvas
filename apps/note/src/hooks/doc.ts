import { client } from '@/server';
import { getNewToken } from '@/server/sign';
import { useQuery } from '@tanstack/vue-query';
import type { InferResponseType } from 'hono';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
export type Doc = InferResponseType<(typeof client.workspace.doc)['$get'], 200>;
/**
 * ### 获取文档
 * @param id 文档id
 */
export const useGetDoc = () => {
  const route = useRoute();
  const fileId = ref<string>(route.params.fileId as string);
  const folderId = ref<string>(route.params.folderId as string);
  const workspaceId = ref<string>(route.params.workspaceId as string);
  watch(
    () => route.params,
    (newVal) => {
      workspaceId.value = newVal.workspaceId as string;
      fileId.value = newVal.fileId as string;
      folderId.value = newVal.folderId as string;
    },
  );
  const { data, isLoading, isFetching } = useQuery<Doc, Error>({
    queryKey: ['doc', workspaceId.value],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.workspace.doc.$get(
        {
          query: {
            id: fileId.value || folderId.value,
            type: fileId.value ? 'file' : 'folder',
            workspaceId: workspaceId.value,
          },
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
  return { data, isLoading, isFetching };
};
