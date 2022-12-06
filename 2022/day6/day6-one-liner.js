const { readFileSync } = require("fs");
const { resolve } = require("path");
const contents = readFileSync(resolve(__dirname, "day6.txt"), "utf-8");

const output = [4,14].map(r => Array.prototype.findIndex.call(contents, (_, i, c) => new Set(c.slice(i - r, i)).size === r))
console.log(output)


