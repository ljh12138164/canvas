export const lib = 'lib';

// 快排
export const quickSort = (arr: number[]) => {
  let i = 0;
  for (let j = 0; j < arr.length; j++) {
    if (arr[j] < arr[i]) {
      i = j;
    }
  }
  return arr;
};
export class MyPromise {
  private callbacks: Function[] = [];
  private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
  // @ts-ignore
  private value: any;

  constructor(executor: (resolve: (value: any) => void, reject: (reason: any) => void) => void) {
    const resolve = (value: any) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.callbacks.forEach((callback) => callback(value));
      }
    };

    const reject = (reason: any) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.value = reason;
        this.callbacks.forEach((callback) => callback(reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // then(onFulfilled: (value: any) => any) {
  //   if (this.state === 'pending') {
  //     this.callbacks.push(onFulfilled);
  //   } else {
  //     onFulfilled(this.value);
  //   }
  //   return this;
  // }
}
// @ts-ignore
function promiseAll(promises: Promise<any>[]) {
  return new Promise((resolve, reject) => {
    // 参数校验
    if (!Array.isArray(promises)) {
      return reject(new TypeError('promises must be an array'));
    }

    const results: Promise<any>[] = [];
    let completed = 0;
    const len = promises.length;

    // 处理空数组的情况
    if (len === 0) {
      return resolve(results);
    }

    // 遍历处理每个promise
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((result) => {
          results[index] = result;
          completed++;

          // 所有promise都完成时，返回结果
          if (completed === len) {
            resolve(results);
          }
        })
        .catch(reject); // 任何一个promise失败都会直接reject
    });
  });
}

/**
 * ### 深拷贝
 *
 */
// @ts-ignore
function deepClone(obj: any): any {
  // 处理基本类型和 null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map((item: any) => deepClone(item));
  }

  // 处理普通对象
  const clonedObj: any = {};
  Object.keys(obj).forEach((key) => {
    clonedObj[key] = deepClone(obj[key]);
  });

  return clonedObj;
}
