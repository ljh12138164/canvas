import { to } from "await-to-js";
/**
 * 捕获错误
 * @param fn 需要捕获错误的函数
 * @returns 返回函数执行结果
 */
export const catchError = async <T>(fn: () => Promise<T>) => {
  const [err, data] = await to(fn());
  if (err) throw new Error(err.message);
  return data;
};
