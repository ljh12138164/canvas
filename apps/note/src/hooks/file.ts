import { client } from '@/server';
import { useMutation } from '@tanstack/vue-query';
import { InferRequestType, InferResponseType } from 'hono';

type CreateFilesResponse = InferResponseType<
  (typeof client.file.createFile)['$post'],
  200
>;
type CreateFilesRequest = InferRequestType<typeof client.file.createFile.$post>;

export const createFiles = (token: string) => {
  const { mutate: createFile, isPending: createFileIsPending } = useMutation<
    CreateFilesResponse,
    Error,
    CreateFilesRequest
  >({
    mutationFn: async (data) => {
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
