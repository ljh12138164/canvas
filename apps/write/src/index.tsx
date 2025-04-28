import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
/**
 * ### 快排
 */
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }
  const base = arr.pop()!;
  const left: number[] = [];
  const right: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < base) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat(base, quickSort(right));
}
/**
 * ### 防抖
 */
function debounce(fn: Function, delay = 1000, maxDelay = 5000) {
  let timerr: number | null = null;
  let time = 0;
  return (...args: any[]) => {
    if (!time) time = Date.now();
    if (Date.now() - time! >= maxDelay && time) {
      // @ts-ignore
      fn.apply(this, args);
      time = 0;
      if (timerr) clearTimeout(timerr);

      return;
    }
    if (timerr) clearTimeout(timerr);

    timerr = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args);
    }, delay);
  };
}
const arr = [1, 3, 2, 4, 5, 6, 7, 8, 9, 10];
const rootEl = document.getElementById('root');

const App = () => {
  const [count, setCount] = React.useState(0);
  const click = useMemo(() => {
    return debounce(
      () => {
        setCount((count) => count + 1);
      },
      1000,
      5000,
    );
  }, []);
  return (
    <div>
      <h1>{count}</h1>
      <button type="button" onClick={click}>
        123
      </button>
      <h2>{quickSort(arr)}</h2>
      <div className="double-line" style={{ width: '100px' }}>
        111111111111111111111111111111111111111111111111111111111111111
      </div>
    </div>
  );
};

/**
 * @param {number[][]} mat
 * @return {number[]}
 */
const rowAndMaximumOnes = (mat: number[][]): number[] => {
  let max = 0;
  let index = 0;
  for (let i = 0; i < mat.length; i++) {
    const count = mat[i].reduce((acc, cyr) => acc + cyr, 0);
    if (count > max) {
      index = i;
      max = count;
    }
  }
  return [index, max];
};
rowAndMaximumOnes([
  [0, 1],
  [1, 0],
]);
class Tree {
  public value: number;
  public left: Tree | null = null;
  public right: Tree | null = null;
  constructor(value: number) {
    this.value = value;
  }
}
const tree = new Tree(1);
tree.left = new Tree(2);
tree.right = new Tree(3);
tree.left.left = new Tree(4);
tree.left.right = new Tree(5);
tree.right.left = new Tree(6);
tree.right.right = new Tree(7);
/**
 * ### 二叉树的中序遍历
 */
function inorederTraversal(root: Tree | null) {
  if (!root) return [];
  const arr: number[] = [];
  function fn(root: Tree) {
    if (root.left) fn(root.left);
    arr.push(root.value);
    if (root.right) fn(root.right);
  }
  fn(root);
  return arr;
}
inorederTraversal(tree);
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
