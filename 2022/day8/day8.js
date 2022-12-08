const { readFileSync } = require("fs");
const { resolve } = require("path");
function syncReadFile(filename) {
    const contents = readFileSync(resolve(__dirname, filename), "utf-8");

    const arr = contents.split(/\r?\n/);

    return arr;
}
const input = syncReadFile("./day8.txt");

const splitAndCast = input
    .map(line => line.split("").map(str => +str))
const tranposed = splitAndCast[0].map((_, colIndex) => splitAndCast.map(row => row[colIndex]))


const step1 = splitAndCast.reduce((prv, curr, idx, grid) => {
    const rowSum = curr.reduce((sum, tree, index, row) => {
        if (index === 0 || index === row.length - 1 || idx === 0 || idx === grid.length - 1) {
            return sum + 1
        }
        const up = tranposed[index].slice(0, idx)
        const down = tranposed[index].slice(idx + 1)
        const left = row.slice(0, index)
        const right = row.slice(index + 1)

        if (tree > Math.max(...up) || tree > Math.max(...down) || tree > Math.max(...left) || tree > Math.max(...right)) {
            return sum + 1
        }
        return sum
    }, 0)
    return prv + rowSum
}, 0)

const findLength = (trees, limit) => {
    const slice = trees.findIndex(tree => tree >= limit) + 1
    const fullSlice = slice ? slice : trees.length
    return trees.slice(0, fullSlice).length
}

const step2 = splitAndCast.reduce((prv, curr, idx) => {
    const rowSum = curr.reduce((sum, tree, index, row) => {
        const up = findLength(tranposed[index].slice(0, idx).reverse(), tree)
        const down = findLength(tranposed[index].slice(idx + 1), tree)
        const left = findLength(row.slice(0, index).reverse(), tree)
        const right = findLength(row.slice(index + 1), tree)

        const scenicScore = [up, down, left, right].reduce((a, b) => a * b, 1)

        return scenicScore > sum ? scenicScore : sum
    }, 0)
    return rowSum > prv ? rowSum : prv
}, 0)

console.log(step1)
console.log(step2)