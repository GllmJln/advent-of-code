const { readFileSync } = require("fs");
const { resolve } = require("path");
function syncReadFile(filename) {
    const contents = readFileSync(resolve(__dirname, filename), "utf-8");

    const arr = contents.split("");

    return arr;
}
const output = syncReadFile("./day6.txt");
console.log(output);

const step1 = output
    .findIndex((_, index) => index - 4 >= 0 ? [...new Set(output.slice(index - 4, index))].length === 4 : false)
const step2 = output
    .findIndex((_, index) => index - 14 >= 0 ? [...new Set(output.slice(index - 14, index))].length === 14 : false)

console.log(step1)
console.log(step2)