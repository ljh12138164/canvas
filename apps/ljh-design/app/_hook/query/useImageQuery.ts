import { client } from '@/app/_database';
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
        const error = (await response.json()) as { errors: string[] };
        throw new Error(error.errors.join('\n'));
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
