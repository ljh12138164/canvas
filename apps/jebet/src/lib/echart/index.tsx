import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
/**
 * ### 根据今天的时间生成进7/14/30的日期数据的数组
 * @param type 7/14/30
 * @returns []
 */
export const getData = <T extends number>(type: T) => {
  const newDate = new Date().getTime();
  const arr = Array.from({ length: type }, (_, index) => {
    return format(new Date(newDate - index * 60 * 60 * 24 * 1000), 'yyyy-MM-dd', { locale: zhCN });
  });
  return arr;
};
