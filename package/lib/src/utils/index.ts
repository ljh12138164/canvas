/**
 * ### 观察者模式
 * # 使用哈希表存储事件({event: [fn1, fn2, fn3]})
 * # 使用数组存储事件的回调函数
 * # 使用on方法添加事件
 * # 使用emit方法触发事件
 * # 使用off方法移除事件
 * # 使用off方法移除事件
 */
class Obswer {
  public event: Record<string, Function[]>;
  constructor() {
    this.event = {};
  }
  public off(event: string, fn: Function) {
    this.event[event] = this.event[event].filter((f) => f !== fn);
  }

  public on(event: string, fn: Function) {
    this.event[event] = this.event[event] || [];
    this.event[event].push(fn);
    return {
      off: () => this.off(event, fn),
    };
  }
  public emit(event: string, ...args: any[]) {
    this.event[event]?.forEach((fn) => fn(...args));
  }
}

/**
 * ### 二叉树
 */
class TreeNode {
  public val: number;
  public left: TreeNode | null;
  public right: TreeNode | null;
  constructor(val: number, left: TreeNode | null, right: TreeNode | null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  public root: TreeNode | null;
  constructor(root: TreeNode | null) {
    this.root = root;
  }
}
const tree = new Tree(new TreeNode(1, null, null));
tree.root!.left = new TreeNode(2, null, null);
tree.root!.right = new TreeNode(3, new TreeNode(4, null, null), new TreeNode(5, null, null));
// 中序遍历
const center = (tree: TreeNode) => {
  const rootNode = tree;
  const arr: number[] = [];
  const digui = (root: TreeNode) => {
    if (root.left) digui(root.left);
    arr.push(root.val);
    if (root.right) digui(root.right);
  };
  digui(rootNode);
  return arr;
};
const left = (tree: TreeNode) => {
  const rootNode = tree;
  const arr: number[] = [];
  const digui = (root: TreeNode) => {
    arr.push(root.val);
    if (root.left) digui(root.left);
    if (root.right) digui(root.right);
  };
  digui(rootNode);
  return arr;
};
const right = (tree: TreeNode) => {
  const rootNode = tree;
  const arr: number[] = [];
  const digui = (root: TreeNode) => {
    if (root.left) digui(root.left);
    if (root.right) digui(root.right);
    arr.push(root.val);
  };
  digui(rootNode);
  return arr;
};
// 快排
const quils = (arr: number[]): number[] => {
  if (arr.length <= 1) return arr;
  const base = arr.at(-1)!;
  const left = [];
  const right = [];
  1;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < base) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quils(left), base, ...quils(right)];
};
export default Obswer;

/**
 * ### 迭代器
 */
const myIterable = {
  data: [10, 20, 30],
  [Symbol.iterator]() {
    let index = 0; // 内部状态：当前遍历的索引
    return {
      next: () => {
        if (index < this.data.length) return { value: this.data[index++], done: false };
        return { done: true }; // 遍历完成
      },
    };
  },
};

// 测试
// for (const num of myIterable) {
//   console.log(num); // 输出 10, 20, 30
// }
