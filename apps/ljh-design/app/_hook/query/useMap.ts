import { useQuery } from '@tanstack/react-query';

interface MAP {
  citycode: string[];
  adcode: string;
  name: string;
  center: string;
  level: string;
  districts: MAP[];
}

interface MapData {
  districts: MAP[];
}
/**
 * ### 获取地图数据
 */
export const useMap = () => {
  const { data, isLoading } = useQuery<MapData>({
    queryKey: ['map'],
    queryFn: async () => {
      const response = await fetch('/distact.json', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json();
    },
  });
  return { data, isLoading };
};

/**
 * ### 获取世界地图
 */
export const useMapData = (code?: number) => {
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
