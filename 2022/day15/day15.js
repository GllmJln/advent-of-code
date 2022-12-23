import { readFileSync } from "fs";
import { parse, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function syncReadFile(filename) {
    const contents = readFileSync(resolve(__dirname, filename), "utf-8");

    const arr = contents.split(/\r?\n/);

    return arr;
}

const input = syncReadFile("./day15.txt");
const parseInput = input.map(value => value.split(":").map(value => value.match(/-?\d+/g).map(value => +value)))


parseInput.forEach(value => value.push(Math.abs(value[0][0] - value[1][0]) + Math.abs(value[0][1] - value[1][1])))

const arrayRange = (start, end) => Array.from({ length: end - start }, (_, k) => k + start)

const countPostionsNotInLine = (line) => {
    const positionsNotInLine = []
    parseInput.forEach((curr) => {
        if (curr[0][1] + curr[2] < line && curr[0][1] - curr[2] < line) {
            return;
        }
        const Xrange = curr[2] - Math.abs(curr[0][1] - line)
        positionsNotInLine.push(arrayRange(curr[0][0] - Xrange, curr[0][0] + Xrange))
    })
    return new Set(positionsNotInLine.flat()).size
}

console.log(countPostionsNotInLine(2000000))
