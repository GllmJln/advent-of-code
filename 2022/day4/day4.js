const { readFileSync } = require("fs");
const { resolve } = require("path");
function syncReadFile(filename) {
    const contents = readFileSync(resolve(__dirname, filename), "utf-8");

    const arr = contents.split(/\r?\n/);

    return arr;
}
const output = syncReadFile("./day4.txt");
console.log(output);

const isIncluded = (range1, range2) => {
    const range1Start = +range1[0]
    const range1End = +range1[1]
    const range2Start = +range2[0]
    const range2End = +range2[1]
    return (range1Start >= range2Start && range1End <= range2End) || (range2Start >= range1Start && range2End <= range1End)
}

const overlap = (range1, range2) => {
    const range1Start = +range1[0]
    const range1End = +range1[1]
    const range2Start = +range2[0]
    const range2End = +range2[1]
    return (range1Start <= range2End && range2Start <= range1End)
}

const step1 = output
    .map(assignments => assignments.split(","))
    .map(assignments => assignments.map(pairs => pairs.split("-")))
    .filter(assignments => isIncluded(...assignments))
    .length

const step2 = output
    .map(assignments => assignments.split(","))
    .map(assignments => assignments.map(pairs => pairs.split("-")))
    .filter(assignments => overlap(...assignments))
    .length

console.log(step1)
console.log(step2)