import { client } from '@/server';
import { getNewToken } from '@/server/sign';
import { useMutation } from '@tanstack/vue-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'vue-router';

const router = useRouter();

type CreateFilesResponse = InferResponseType<(typeof client.file.createFile)['$post'], 200>;
type CreateFilesRequest = InferRequestType<typeof client.file.createFile.$post>;

export const createFiles = () => {
  const { mutate: createFile, isPending: createFileIsPending } = useMutation<CreateFilesResponse, Error, CreateFilesRequest>({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.file.createFile.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    },
  });
  return { createFile, createFileIsPending };
};
