import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);

  return arr;
}

const input = syncReadFile("./day12.txt");

const alphabet = "abcdefghijklmnopqrstuvwxyz";

const findPos = (input, value) => {
  const Y = input.findIndex((line) => line.includes(value));
  const X = input[Y].findIndex((row) => row === value);
  return [Y, X];
};

const applyMove = (currPos, move) => {
  return currPos.map((coord, idx) => coord + move[idx]);
};

const getHeight = (letter) => {
  switch (letter) {
    case "S":
      return alphabet.indexOf("a");
    case "E":
      return alphabet.indexOf("z");
    default:
      return alphabet.indexOf(letter);
  }
};

const getValidMoves = (splitInput, currPos) => {
  const moves = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const withinBoundMoves = moves.filter(
    (move) =>
      currPos[0] + move[0] < splitInput.length &&
      currPos[0] + move[0] >= 0 &&
      currPos[1] + move[1] >= 0 &&
      currPos[1] + move[1] < splitInput[0].length
  );

  return withinBoundMoves.filter((move) => {
    const newPos = applyMove(currPos, move);
    const newPosValue = splitInput[newPos[0]][newPos[1]];
    const oldPosValue = splitInput[currPos[0]][currPos[1]];
    const heightDiff = getHeight(newPosValue) - getHeight(oldPosValue) <= 1;
    return heightDiff;
  });
};

const moveOneStep = (splitInput, solverObject) => {
  const stepMoves = [];
  const moves = solverObject.currPos;
  moves.forEach((move) => {
    const currPos = move[move.length - 1];
    const validMoves = getValidMoves(splitInput, currPos);
    const appliedMoves = validMoves.map((move) => applyMove(currPos, move));
    appliedMoves.forEach((appliedMove) => {
      if (!solverObject.visited.has(JSON.stringify(appliedMove))) {
        stepMoves.push([appliedMove]);
        solverObject.visited.add(JSON.stringify(appliedMove));
      }
    });
  });
  solverObject.currPos = [...stepMoves];
};

const hasEndPosition = (moves, endingPos) => {
  return moves.currPos.findIndex((move) =>
    JSON.stringify(move).includes(JSON.stringify(endingPos))
  );
};

const solveFromStartingPosition = (
  splitInput,
  startingPos,
  endingPos,
  currentMin
) => {
  const moves = {
    visited: new Set().add(JSON.stringify(startingPos)),
    currPos: [[startingPos]], // don't need to be triple depth array, but refactoring this will take too long
  };

  let stepCount = 0;
  while (hasEndPosition(moves, endingPos) === -1) {
    moveOneStep(splitInput, moves);
    stepCount++;
    if (currentMin && stepCount >= currentMin) {
      //stop looping if not current min
      break;
    }
  }
  return stepCount;
};

const getAllStartingPositions = (splitInput) => {
  return splitInput.flatMap((line, lineIdx) =>
    line
      .map((char, charIdx) => (char === "a" ? [lineIdx, charIdx] : false))
      .filter((value) => value)
  );
};

export const step1 = (input) => {
  const splitInput = input.map((line) => line.split(""));
  const startingPos = findPos(splitInput, "S");
  const endingPos = findPos(splitInput, "E");
  return solveFromStartingPosition(splitInput, startingPos, endingPos);
};

export const step2 = (input) => {
  const splitInput = input.map((line) => line.split(""));
  const endingPos = findPos(splitInput, "E");
  const startingPositions = getAllStartingPositions(splitInput);
  return startingPositions.reduce(
    (prev, curr) =>
      solveFromStartingPosition(splitInput, curr, endingPos, prev),
    0
  );
};
console.log(step1(input));
console.log(step2(input));
