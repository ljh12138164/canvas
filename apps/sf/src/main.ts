var destCity = function (paths: [string, string][]) {
  const obj = {};
  for (let i = 0; i < paths.length; i++) {
    obj[paths[i][0]] = paths[i][1];
  }
  let start = paths[0][0];
  while (true) {
    if (obj[start]) start = obj[start];
    else return start;
  }
};
console.log(
  destCity([
    ["London", "New York"],
    ["New York", "Lima"],
    ["Lima", "Sao Paulo"],
  ])
);
