import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { getCycles, step1, step2 } from "./day10";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);

  return arr;
}

const sampleInput = syncReadFile("./day10-sample.txt");
const actualInput = syncReadFile("./day10.txt");

it("should return 13140", () => {
  expect(step1(sampleInput)).toEqual(13140);
});

it("should return 12520", () => {
  expect(step1(actualInput)).toEqual(12520);
});

it("should return the sample pattern", () => {
  expect(step2(sampleInput)).toEqual(
    `
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`.slice(1)
  );
});

it("should return the actual pattern", () => {
  expect(step2(actualInput)).toEqual(
    `
####.#..#.###..####.###....##..##..#....
#....#..#.#..#....#.#..#....#.#..#.#....
###..####.#..#...#..#..#....#.#....#....
#....#..#.###...#...###.....#.#.##.#....
#....#..#.#....#....#....#..#.#..#.#....
####.#..#.#....####.#.....##...###.####.`.slice(1)
  );
});

it("should return the expected output", () => {
  expect(getCycles(sampleInput)[20]).toEqual(21);
  expect(getCycles(sampleInput)[60]).toEqual(19);
  expect(getCycles(sampleInput)[100]).toEqual(18);
  expect(getCycles(sampleInput)[140]).toEqual(21);
  expect(getCycles(sampleInput)[180]).toEqual(16);
  expect(getCycles(sampleInput)[220]).toEqual(18);
});
