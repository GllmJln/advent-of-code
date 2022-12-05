const { readFileSync } = require("fs");
const { resolve } = require("path");
function syncReadFile(filename) {
    const contents = readFileSync(resolve(__dirname, filename), "utf-8");

    const arr = contents.split(/\r?\n/);

    return arr;
}
const output = syncReadFile("./day5.txt");
console.log(output);

const splitIndex = output.findIndex(firstMove => firstMove.includes("move"))

const splitStr = (column, qty = 4) => {
    const gameColumns = [];
    for (let i = 0; i < column.length; i += qty) {
        gameColumns.push(column.substring(i, i + qty));
    }
    return gameColumns
}

const moves = output.slice(splitIndex).map(row => row.split(" ")).map(row => [+row[1], +row[3], +row[5]])
const crates = output.slice(0, splitIndex - 1).map(column => splitStr(column))

const step1Columns = crates[0].map((_, colIndex) => crates.map(row => row[colIndex].trim()).reduce((prev, curr) => !curr.length ? prev : [...prev, curr], []))
// Reference crates and not step1 columns because modifying step1Columns by reference
const step2Columns = crates[0].map((_, colIndex) => crates.map(row => row[colIndex].trim()).reduce((prev, curr) => !curr.length ? prev : [...prev, curr], []))
step1Columns.forEach(column => column.reverse())
step2Columns.forEach(column => column.reverse())

const moveOneCrate = (crates, from, to) => {
    const fromColumn = crates[+from - 1]
    if (fromColumn.length > 1) {
        const movedCrate = fromColumn.pop()
        const toColumn = crates[+to - 1]
        toColumn.push(movedCrate)
    }
    return crates
}

const moveRowOfCratesMultipleTimes = (crates, qty, from, to) => {
    for (let i = 0; i < qty; i++) {
        moveOneCrate(crates, from, to)
    }
    return crates
}

const moveMultipleCratesInPlace = (crates, qty, from, to) => {
    const fromColumn = crates[+from - 1]
    if (fromColumn.length > 1) {
        const movingCrates = fromColumn.splice(fromColumn.length - qty, qty)
        const toColumn = crates[+to - 1]
        toColumn.push(...movingCrates)
    }
    return crates
}

moves.forEach(move => moveRowOfCratesMultipleTimes(step1Columns, ...move))
moves.forEach(move => moveMultipleCratesInPlace(step2Columns, ...move))

const step1 = step1Columns.flatMap(row => row.slice(row.length - 1)).join("").replace(/\[?\]?/g, "")
const step2 = step2Columns.flatMap(row => row.slice(row.length - 1)).join("").replace(/\[?\]?/g, "")

console.log(step1)
console.log(step2)