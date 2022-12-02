const { readFileSync } = require('fs');
const { resolve } = require('path')
function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);

  return arr;
}
const output = syncReadFile('./day1.txt');
console.log(output)

const s = output
  .join()
  .split(',,')
  .map(v =>
    v
      .split(',')
      .reduce((a, b) => +a + +b, 0)
  )

console.log(Math.max(...s)) //Step 1
console.log(s.sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a + b, 0)) //Step 2
