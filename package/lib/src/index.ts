export * from './auth';
export * from './plugin';
/**
 * ## fandou
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay = 1000) => {
  let timeoutId: number | NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};
/**
 * ## 节流
 */
export const throttle = <T extends (...args: any[]) => any>(fn: T, delay = 1000) => {
  let lastTime = 0;
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
};
/**
 * ### 柯里化
 */
export const kelihua = (fn: Function) => {
  return function curried(...args: any[]) {
    // 如果传入参数
    if (args.length >= fn.length) {
      // @ts-ignore
      return fn.apply(this, args);
    }
    // 如果传入参数大于默认
    return function (...nextArgs: any[]) {
      // @ts-ignore
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
};
// const add = (a: number, b: number) => a + b;
// const curriedAdd = kelihua(add);
// const result = curriedAdd(1)(2); // 返回 3

/**
 * ## 快排
 */
export const kuaipai = (arr: number[]): number[] => {
  if (arr.length <= 1) return arr;
  const base = arr.at(-1) as number;
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < base) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...kuaipai(left), base, ...kuaipai(right)];
};

class TreeNode {
  public value: number;
  public left: TreeNode | null;
  public right: TreeNode | null;
  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

const data = new TreeNode(1);
data.left = new TreeNode(32);
data.right = new TreeNode(332);
data.left.left = new TreeNode(123);

// 前序遍历顺序是：根节点 -> 左子树 -> 右子树
// 中序遍历顺序是：左子树 -> 根节点 -> 右子树
// 后序遍历顺序是：左子树 -> 右子树 -> 根节点
const bianli = (initTree: TreeNode) => {
  // if(data.value)
  const arr: number[] = [];

  const bianliFn = (tree: TreeNode) => {
    if (!tree.value) return;
    arr.push(tree.value);
    if (tree.left) bianliFn(tree.left);
    if (tree.right) bianliFn(tree.right);
  };
  bianliFn(initTree);
  return arr;
};
bianli(data);
// 给你一个数组 arr ，请你将每个元素用它右边最大的元素替换，如果是最后一个元素，用 -1 替换。
// 完成所有替换操作后，请你返回这个数组。
// 示例 1：
// 输入：arr = [17,18,5,4,6,1]
// 输出：[18,6,6,6,1,-1]
// 解释：
// - 下标 0 的元素 --> 右侧最大元素是下标 1 的元素 (18)
// - 下标 1 的元素 --> 右侧最大元素是下标 4 的元素 (6)
// - 下标 2 的元素 --> 右侧最大元素是下标 4 的元素 (6)
// - 下标 3 的元素 --> 右侧最大元素是下标 4 的元素 (6)
// - 下标 4 的元素 --> 右侧最大元素是下标 5 的元素 (1)
// - 下标 5 的元素 --> 右侧没有其他元素，替换为 -1

// const change = (arr: number[]) => {
//   for (let i = 1; i < arr.length - 1; i++) {
//     if (i <= arr.length - 1) {
//       let max = arr[i];
//       for (let j = i + 1; j < arr.length - 1; j++) {
//         if (arr[j] > max) max = arr[j];
//       }
//       arr[i] = max;
//     } else {
//       arr[i] = -1;
//     }
//   }
// };

/***
 * ### LRU 算法
 */
export class LRU {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  // 获取
  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    // 删除并重新插入，将键标记为最近使用
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  // 插入
  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      // 如果键已存在，先删除旧的，再插入新的以更新顺序
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 如果容量已满，删除最久未使用的键（即 Map 的第一个键）
      // next设置下一个
      const lruKey = this.cache.keys().next().value;
      // 删除第一个
      if (lruKey) this.cache.delete(lruKey);
    }
    // 插入新键或更新后的键（自动移到末尾表示最近使用）
    this.cache.set(key, value);
  }
}
const reactQueryConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 * 5,
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchInterval: 60 * 1000 * 5,
      refetchIntervalInBackground: true,
    },
  },
};
export { reactQueryConfig };
