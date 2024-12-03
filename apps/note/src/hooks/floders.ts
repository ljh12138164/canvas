import { useMutation } from "@tanstack/vue-query";
import { client } from "@/server";
import { InferRequestType, InferResponseType } from "hono";

type Folder = InferResponseType<typeof client.folder.create.$post, 200>;
type FolderRequest = InferRequestType<typeof client.folder.create.$post>;
/**
 * 创建文件夹
 * @param tokenb
 */
export const useCreateFolder = (token: string) => {
  const { mutate: createFolder, isPending: createFolderIsLoading } =
    useMutation<Folder, Error, FolderRequest>({
      mutationFn: async (data) => {
        const res = await client.folder.create.$post(data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error("创建失败");
        }
        return res.json();
      },
    });
  return { createFolder, createFolderIsLoading };
};
