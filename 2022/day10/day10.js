import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { splitArrayIntoChunks } from "../utils/utils";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);

  return arr;
}

const input = syncReadFile("./day10.txt");

export const getCycles = (input) => {
  const cycles = [1, 1];
  input.forEach((instruction) => {
    const operation = instruction.split(" ");
    cycles.push(cycles[cycles.length - 1]);
    if (operation[0] === "addx") {
      cycles.push(cycles[cycles.length - 1] + +operation[1]);
    }
  });
  return cycles;
};

export const step1 = (input) => {
  const cycles = getCycles(input);
  return cycles.reduce((prev, curr, idx) => {
    return (idx + 20) % 40 === 0 || idx === 20 ? prev + curr * idx : prev;
  }, 0);
};

export const step2 = (input) => {
  const makeScreen = Array.from(Array(40 * 6));
  const cycles = getCycles(input);
  cycles.splice(0, 1);
  const design = makeScreen.map((_, idx) => {
    const crtIdx = idx - 40 * Math.floor(idx / 40);
    return cycles[idx] + 1 >= crtIdx && cycles[idx] - 1 <= crtIdx ? "#" : ".";
  });
  return splitArrayIntoChunks(design, 40)
    .map((line) => line.join(""))
    .join("\n");
};
console.log(step1(input));
console.log(step2(input));
