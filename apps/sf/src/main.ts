var removeDuplicates = function (s: string): string {
  const arr: string[] = [];
  for (let i = 0; i < s.length; i++) {
    if (arr.length) {
      if (arr?.at(-1) === s[i]) arr.pop();
      else arr.push(s[i]);
    } else {
      arr.push(s[i]);
    }
  }
  return arr.join("");
};
console.log(removeDuplicates("abbaca"));
