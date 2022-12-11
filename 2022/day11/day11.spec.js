import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { step1, step2 } from "./day11";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/Monkey/).slice(1);

  return arr;
}

const sampleInput = syncReadFile("./day11-sample.txt");
const actualInput = syncReadFile("./day11.txt");

it("should return the example values for step1", () => {
  expect(step1(sampleInput)).toBe(10605);
});

it("should return the example values for step2", () => {
  expect(step2(sampleInput)).toBe(2713310158);
});

it("should return the actual values for step1", () => {
  expect(step1(actualInput)).toBe(88208);
});

it("should return the actual values for step2", () => {
  expect(step2(actualInput)).toBe(21115867968);
});
