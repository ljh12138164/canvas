export * from './auth';
export * from './vite';
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
    // 如果传入参数大于函数的接受参数数量，直接执行函数
    if (args.length >= fn.length) {
      // @ts-ignore
      return fn.apply(this, args);
    }

    //  递归调用
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
/**
 * ### Promise.all
 */
// export const promiseAll = (arr: Promise<any>[]) => {
//   return new Promise((res, rej) => {
//     const newArr: Promise<any>[] = [];
//     let completedCount = 0;

//     // Handle empty array case
//     if (arr.length === 0) return res([]);

//     arr.forEach((promise, index) => {
//       Promise.resolve(promise).then(
//         (value) => {
//           newArr[index] = value;
//           completedCount++;
//           if (arr.length === completedCount) res(newArr);
//         },
//         (reason) => rej(reason), // Error handling moved here
//       );
//     });
//   });
// };

// const p1 = Promise.resolve(1);
// const p2 = new Promise((resolve) => setTimeout(() => resolve(2), 1000));
// const p3 = Promise.resolve(3);

// promiseAll([p1, p2, p3]).then(
//   (values) => console.log(values), // [1, 2, 3]
//   (reason) => console.error(reason),
// );
/**
 * 并发控制器类
 * 用于限制同时执行的异步任务数量
 */
class ConcurrencyController {
  private maxConcurrent: number; // 最大并发数
  private queue: (() => Promise<any>)[]; // 任务队列
  private activeCount: number; // 当前活跃的任务数

  /**
   * @param maxConcurrent 最大并发数
   */
  constructor(maxConcurrent: number) {
    // 初始化队列数
    this.maxConcurrent = maxConcurrent;
    this.queue = []; // 初始化等待队列
    this.activeCount = 0; // 初始化活跃任务数
  }
  /**
   * ### 创建
   * @returns Promise
   */
  add(task: () => Promise<any>) {
    return new Promise((res, rej) => {
      const wrappedTask = () => {
        const taskResult = task()
          .then(res)
          .catch(rej)
          .finally(() => {
            this.activeCount--;
            this._run();
          });
        return taskResult;
      };

      this.queue.push(wrappedTask);
      this._run();
    });
  }

  private _run() {
    while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      this.activeCount++;
      const task = this.queue.shift();
      task?.();
    }
  }
}

/**
 * 模拟异步请求函数
 * @param id 请求ID
 * @param delay 延迟时间(ms)
 * @param shouldFail 是否模拟失败
 * @returns 返回一个Promise
 */
const mockRequest =
  (id: number, delay: number, shouldFail = false) =>
  () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(`Request ${id} failed`);
        } else {
          console.warn(`Request ${id} succeeded`);
          resolve(`Request ${id} succeeded`);
        }
      }, delay);
    });

// 使用示例：创建一个最大并发数为2的控制器
const controller = new ConcurrencyController(2);
// 添加三个任务，由于最大并发数为2，第三个任务会等待前面任务完成后执行
controller.add(() => mockRequest(1, 1000)());
controller.add(() => mockRequest(2, 1000)());
controller.add(() => mockRequest(3, 500)());
const lengthOfLIS = (nums: number[]) => {
  const dp = new Array(nums.length).fill(1);
  for (let i = 0; i < nums.length; i++) {
    // i与i前面的元素比较
    for (let j = 0; j < i; j++) {
      // 找比i小的元素，找到一个，就让当前序列的最长子序列长度加1
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  // 找出最大的子序列
  return Math.max(...dp);
};

lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]);
// console.log(a);
