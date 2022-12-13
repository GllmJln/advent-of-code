import { readFileSync } from "fs";
import { parse, resolve } from "path";
import { fileURLToPath } from "url";
import { splitArrayIntoChunks } from "../utils/utils.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);

  return arr;
}

const input = syncReadFile("./day13.txt");

export const compare = (left, right) => {
  if (typeof left === "number" && typeof right === "number") {
    return left === right ? undefined : left < right;
  } else if (Array.isArray(left) && Array.isArray(right)) {
    return processArray(left, right);
  } else if (
    (Array.isArray(left) && typeof right === "number") ||
    (Array.isArray(right) && typeof left === "number")
  ) {
    return typeof left === "number"
      ? compare([left], right)
      : compare(left, [right]);
  } else {
    return left === undefined && right !== undefined;
  }
};

const processArray = (left, right) => {
  let i = 0;
  let result;
  // Could be a for loop, but I've refactored too much already :cry:
  while (result === undefined) {
    if (left[i] === undefined && right[i] === undefined) {
      break;
    }
    result = compare(left[i], right[i]);
    i++;
  }
  return result;
};

const parseInput = (input) => {
  return input.filter((line) => line).map((line) => JSON.parse(line));
};

export const step1 = (input) =>
  splitArrayIntoChunks(parseInput(input), 2).reduce(
    (prev, curr, idx) => (compare(curr[0], curr[1]) ? prev + idx + 1 : prev),
    0
  );

export const step2 = (input) => {
  const dividers = [[[2]], [[6]]];
  const parsedInput = parseInput(input);
  parsedInput.push(...dividers);
  const sortedInput = parsedInput.sort((a, b) => (compare(a, b) ? -1 : 1));
  return dividers.reduce(
    (prev, curr) =>
      (sortedInput.findIndex(
        (line) => JSON.stringify(line) === JSON.stringify(curr)
      ) +
        1) *
      prev,
    1
  );
};
console.log(step1(input));
console.log(step2(input));
