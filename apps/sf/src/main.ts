var divideArray = function (nums) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (!map.get(nums[i])) map.set(nums[i], 1);
    else map.set(nums[i], map.get(nums[i]) + 1);
  }
  return [...map.values()].filter((item) => item % 2 === 0).length === 0;
};
console.log(divideArray([3, 2, 3, 2, 2, 2]));
