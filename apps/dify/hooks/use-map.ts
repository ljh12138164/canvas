import { useQuery } from '@tanstack/react-query';

/**
 * ### 获取世界地图
 */
export const useMap = (code?: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ['map', code],
    queryFn: async () => {
      let address = '';
      address = `${code}`;
      if (!code) address = 'china';
      const res = await fetch(`https://geojson.cn/api/china/${address}.json`);
      const json = await res.json();
      return json;
    },
  });
  return { data, isLoading };
};
