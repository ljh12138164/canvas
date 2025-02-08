import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useUser } from '@/app/_store/auth';
import { useQuery } from '@tanstack/react-query';
import type { InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
export type GetTemplateResponseType = InferResponseType<
  (typeof client.template.default)['$get'],
  200
>;
/**
 * ### 获取默认模板
 */
export const useTemplate = () => {
  const {
    data: dataDefault,
    isLoading: isLoadingDefault,
    error: errorDefault,
  } = useQuery<GetTemplateResponseType, Error>({
    queryKey: ['templateDefault'],
    queryFn: async () => {
      const response = await client.template.default.$get();
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { dataDefault, isLoadingDefault, errorDefault };
};

export type GetUserTemplateResponseType = InferResponseType<
  (typeof client.template.userTemplate)['$get'],
  200
>;
/**
 * ### 获取用户模板
 */
export const useUserTemplate = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    data: dataUserTemplate,
    isLoading: isLoadingUserTemplate,
    error: errorUserTemplate,
  } = useQuery<GetUserTemplateResponseType, Error>({
    queryKey: ['templateUser', user?.user.user_metadata.sub],
    queryFn: async () => {
      const token = await getNewToken();
      if (!token) router.push('/sign-in');
      const response = await client.template.userTemplate.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { dataUserTemplate, isLoadingUserTemplate, errorUserTemplate };
};
