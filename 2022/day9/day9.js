import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { getUniqueValuesArrays } from "../utils/utils.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);

  return arr;
}
const input = syncReadFile("./day9.txt");

export const startingMap = (length) => {
  const map = {};
  for (let i = 0; i < length; i++) {
    map[i] = {
      currPos: [0, 0],
      visited: [[0, 0]],
    };
  }
  return map;
};

const mappingTemplate = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
};

const addMoveToPos = (move, position) => {
  return position.map((pos, index) => +pos + move[index]);
};

export const isInPlace = (tail, head) => {
  const [xHead, yHead] = head;
  const [xTail, yTail] = tail;
  const xdiff = xHead - xTail;
  const ydiff = yHead - yTail;
  return xdiff * xdiff <= 1 && ydiff * ydiff <= 1;
};

const moves = [...Object.values(mappingTemplate)];
const diagonalMoves = [
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

export const getNewTailPos = (tail, head) => {
  if (isInPlace(tail, head)) {
    return tail;
  }
  const isOnSameRowOrColumn = tail.some((pos, idx) => pos === head[idx]);
  const validMove = (isOnSameRowOrColumn ? moves : diagonalMoves).find((move) =>
    isInPlace(addMoveToPos(move, tail), head)
  );
  return addMoveToPos(validMove, tail);
};

export const solve = (fnInput, map) => {
  fnInput.forEach((line) => {
    const [cmd, qty] = line.split(" ");
    for (let i = 0; i < +qty; i++) {
      const movement = mappingTemplate[cmd];
      map[0].currPos = addMoveToPos(movement, map[0].currPos);
      map[0].visited.push(map[0].currPos);
      for (let i = 1; i < Object.keys(map).length; i++) {
        map[i].currPos = getNewTailPos(map[i].currPos, map[i - 1].currPos);
        map[i].visited.push(map[i].currPos);
      }
    }
  });
  const tail = Object.keys(map).length - 1;

  const visited = getUniqueValuesArrays(map[tail].visited);

  return { size: visited.size, visited };
};

console.log(solve(input, startingMap(2)).size);
console.log(solve(input, startingMap(10)).size);
