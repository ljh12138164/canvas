import { client } from '@/server';
import { getNewToken } from '@/server/sign';
import { useMutation } from '@tanstack/vue-query';
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

type UpdateFilesResponse = InferResponseType<(typeof client.folder.update)['$patch'], 200>;
type UpdateFilesRequest = InferRequestType<typeof client.folder.update.$patch>;
export const updateFiles = () => {
  const { mutate: updateFile, isPending: updateFileIsPending } = useMutation<
    UpdateFilesResponse,
    Error,
    UpdateFilesRequest
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) router.push('/login');
      const res = await client.folder.update.$patch(data, {
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
