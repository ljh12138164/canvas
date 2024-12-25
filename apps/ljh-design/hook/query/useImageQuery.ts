import { client } from '@/server';
import { useQuery } from '@tanstack/react-query';

export const useImageQuery = () => {
  const {
    isLoading: getImageLoading,
    data: imageData,
    error: getImageError,
  } = useQuery({
    queryKey: ['image'],
    queryFn: async () => {
      const response = await client.image.$get();
      if (!response.ok) {
        throw new Error('请求错误');
      }
      const { data } = await response.json();
      return data;
    },
  });
  return {
    getImageLoading,
    imageData,
    getImageError,
  };
};
