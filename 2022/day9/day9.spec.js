import { getNewTailPos, solve, startingMap } from "./day9";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);

  return arr;
}

const sampleInput = syncReadFile("./day9-sample.txt");
const actualInput = syncReadFile("./day9.txt");

describe("sample input", () => {
  it("should return 13", () => {
    expect(solve(sampleInput, startingMap(2)).size).toEqual(13);
  });
  it("should go to the expected positions", () => {
    expect([...solve(sampleInput, startingMap(2)).visited]).toEqual([
      "[0,0]",
      "[1,0]",
      "[2,0]",
      "[3,0]",
      "[4,1]",
      "[4,2]",
      "[4,3]",
      "[3,4]",
      "[2,4]",
      "[3,3]",
      "[3,2]",
      "[2,2]",
      "[1,2]",
    ]);
  });
});

describe("actual output", () => {
  it("should return 5619", () => {
    expect(solve(actualInput, startingMap(2)).size).toEqual(5619);
  });
  it("should return 2376", () => {
    expect(solve(actualInput, startingMap(10)).size).toEqual(2376);
  });
});

const expected = [
  {
    tail: [0, 0],
    head: [0, 0],
    newTail: [0, 0],
  },
  {
    tail: [3, 0],
    head: [4, 1],
    newTail: [3, 0],
  },
  {
    tail: [3, 0],
    head: [4, 2],
    newTail: [4, 1],
  },
  {
    tail: [4, 1],
    head: [4, 3],
    newTail: [4, 2],
  },
  {
    tail: [2, 0],
    head: [4, 0],
    newTail: [3, 0],
  },
  {
    tail: [5, 0],
    head: [4, 1],
    newTail: [5, 0],
  },
  {
    tail: [5, 0],
    head: [4, 2],
    newTail: [4, 1],
  },
];
describe("getNewTailPos", () => {
  it.each(expected)("should return %o", (testCase) => {
    const { tail, head, newTail } = testCase;
    expect(getNewTailPos(tail, head)).toEqual(newTail);
  });
});
