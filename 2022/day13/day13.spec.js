import { compare } from "./day13";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { step1, step2 } from "./day13";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);

  return arr;
}

const sampleInput = syncReadFile("./day13-sample.txt");
const actualInput = syncReadFile("./day13.txt");

it("should return the example values for step1", () => {
  expect(step1(sampleInput)).toBe(13);
});

it("should return the example values for step2", () => {
  expect(step2(sampleInput)).toBe(140);
});

it("should return the actual values for step1", () => {
  expect(step1(actualInput)).toBe(5198);
});

it("should return the actual values for step2", () => {
  expect(step2(actualInput)).toBe(22344);
});

it("should return the expected value", () => {
  expect(compare([6, 2, 3], [2])).toBe(false);
});
it("should return the expected value", () => {
  expect(compare([2, 2, 3], [2])).toBe(false);
});

it("should return the expected value", () => {
  expect(compare([2], [2, 3])).toBe(true);
});

it("should return the expected value", () => {
  expect(compare(2, undefined)).toBe(false);
});
it("should return the expected value", () => {
  expect(compare(undefined, 2)).toBe(true);
});
it("should return the expected value", () => {
  expect(compare([1, 1, 3, 1, 1], [1, 1, 5, 1, 1])).toBe(true);
});
it("should return the expected value", () => {
  expect(compare([[1], [2, 3, 4]], [[1], 4])).toBe(true);
});
it("should return the expected value", () => {
  expect(compare([9], [[8, 7, 6]])).toBe(false);
});

it("should return the expected value", () => {
  expect(compare([], [[8, 0, [7, [10, 10, 8, 6], 5], 6], [], []])).toBe(true);
});

it("should return the expected value", () => {
  expect(compare([[], [], [], [7], [0]], [([1, []], [], [5, 6])])).toBe(true);
});
