export function removeDuplicates(array: any[]) {
  let a: any[] = [];
  array.map((x) => {
    if (!a.find((y) => y.path.includes(x.path) && y.screen.includes(x.screen))) {
      a.push(x);
    }
  });
  return a;
}
