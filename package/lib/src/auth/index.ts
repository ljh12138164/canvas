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
