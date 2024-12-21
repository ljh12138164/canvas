import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono/client';
import { client } from '..';

/**
 * ## 获取文件夹信息
 */
// export const useStoages = () => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['stoages'],
//     queryFn: () => getStoages(),
//   });
// };

type CreateData = InferRequestType<(typeof client.storage.create)['$post']>;
type CreateResponse = InferResponseType<
  (typeof client.storage.create)['$post']
>;
/**
 * ## 创建文件
 * @param data
 * @returns
 */
export const useCreateStoage = () => {
  const {
    mutate: create,
    isPending: createPending,
    error,
  } = useMutation<CreateResponse, Error, CreateData>({
    mutationFn: async (data) => {
      const res = await client.storage.create.$post({ form: data.form });
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });
  return { create, isLoading: createPending, error };
};
