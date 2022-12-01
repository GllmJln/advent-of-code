const {readFileSync,} = require('fs');
function syncReadFile(filename) {
  const contents = readFileSync(filename, 'utf-8');

  const arr = contents.split(/\r?\n/);

  return arr;
}
const output = syncReadFile('./input-data.txt');

const s = output
  .join()
  .split(',,')
  .map(v =>
    v
    .split(',')
    .reduce((a,b) => +a + +b, 0)
    )

console.log(Math.max(...s)) //Step 1
console.log(s.sort((a,b) => b - a).slice(0,3).reduce((a,b) => a+b, 0) ) //Step 2
