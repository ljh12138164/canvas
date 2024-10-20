let smallestRangeI = function (nums, k) {
  const arr = nums.sort((a, b) => a - b);
  console.log(arr, arr.at(-1) - arr[0]);
  return arr.at(-1) - arr[0] + 2 * k;
};
console.log(smallestRangeI([0, 10], 2));
