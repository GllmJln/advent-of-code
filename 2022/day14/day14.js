import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);

  return arr;
}

const input = syncReadFile("./day14.txt");

const buildMap = (splitLines) => {
  const map = [[0]];
  splitLines.forEach((line) => {
    line.forEach((point, idx) => {
      if (idx === line.length - 1) {
        return;
      }
      const [X, Y] = point.split(",").map((value) => +value);
      const [X2, Y2] = line[idx + 1].split(",").map((value) => +value);
      const maxXIndex = Math.max(...map[0]);
      const maxYIndex = map[map.length - 1][0];

      const maxX = Math.max(X, X2);
      const minX = Math.min(X, X2);
      const maxY = Math.max(Y, Y2);
      const minY = Math.min(Y, Y2);
      if (maxX > maxXIndex) {
        const series = getSeries(maxXIndex, maxX, 1);
        map[0].push(...series);
        map.forEach((line, idx) => {
          if (idx) {
            line.push(...Array.from(Array(series.length)).fill("."));
          }
        });
      }
      if (maxY > maxYIndex) {
        const Yvalues = getSeries(maxYIndex, maxY, 1).map((number) => {
          const line = Array.from(Array(map[0].length - 1).fill("."));
          line.unshift(number);
          return line;
        });
        map.push(...Yvalues);
      }
      const min = isHorizontal(X, X2) ? minX : minY;
      const max = isHorizontal(X, X2) ? maxX : maxY;
      for (let i = min; i < max + 1; i++) {
        isHorizontal(X, X2) ? (map[Y][i] = "#") : (map[i][X] = "#");
      }
    });
  });
  return map;
};

const isHorizontal = (X1, X2) => {
  return X1 !== X2;
};

const getSeries = (startingPoint, endingPoint, step) => {
  let value = startingPoint + 1;
  const range = [];
  while (value !== endingPoint + 1) {
    range.push(value);
    value += step;
  }
  return range;
};

const dropOneSand = (slicedMap, extend) => {
  const sandEntryPoint = slicedMap[0].findIndex(
    (_, idx) => slicedMap[0][idx - 1] === 499
  );
  slicedMap[0][sandEntryPoint] = "o";
  let sandPos = { x: sandEntryPoint, y: 0 };
  let isFinished = false;
  while (true) {
    if (extend) {
      sandPos = extendMap(slicedMap, sandPos);
    }
    const { newSandPos, complete } = moveSand(slicedMap, sandPos);
    if (complete) {
      isFinished = true;
      break;
    }
    if (sandPos.x === newSandPos.x && sandPos.y === newSandPos.y) {
      break;
    }
    sandPos = newSandPos;
  }
  return isFinished;
};

const extendMap = (slicedMap, sandPos) => {
  const { x, y } = sandPos;
  if (x - 1 < 0) {
    slicedMap.forEach((line, idx) =>
      line.unshift(idx === slicedMap.length - 1 ? "#" : ".")
    );
    return { x: x + 1, y };
  } else if (x + 1 > slicedMap[0].length - 1) {
    slicedMap.forEach((line, idx) => {
      line.push(idx === slicedMap.length - 1 ? "#" : ".");
    });
  }
  return { x, y };
};

const moveSand = (slicedMap, sandPos) => {
  const { x, y } = sandPos;
  slicedMap[y][x] = ".";
  if (slicedMap[y + 1] && slicedMap[y + 1][x] === ".") {
    slicedMap[y + 1][x] = "o";
    return { newSandPos: { x, y: y + 1 }, complete: false };
  } else if (slicedMap[y + 1] && slicedMap[y + 1][x - 1] === ".") {
    slicedMap[y + 1][x - 1] = "o";
    return { newSandPos: { x: x - 1, y: y + 1 }, complete: false };
  } else if (slicedMap[y + 1] && slicedMap[y + 1][x + 1] === ".") {
    slicedMap[y + 1][x + 1] = "o";
    return { newSandPos: { x: x + 1, y: y + 1 }, complete: false };
  } else {
    slicedMap[y][x] = "o";
    const complete =
      y + 1 === slicedMap.length ||
      x - 1 < 0 ||
      x + 1 > slicedMap[0].length ||
      (y === 0 && slicedMap[0][x - 1] === 499);
    return {
      newSandPos: { x, y },
      complete: complete,
    };
  }
};

const prepareInput = (input) => {
  const splitLines = input.map((line) => line.split(" -> "));

  const map = buildMap(splitLines);

  const firstRockXIndex = map.reduce((prev, curr) => {
    const firstRockIndex = curr.findIndex((value) => value === "#");
    return firstRockIndex < prev && firstRockIndex > -1 ? firstRockIndex : prev;
  }, map[0].length);

  return map.map((line) => line.slice(firstRockXIndex));
};

const step1 = (input) => {
  const slicedMap = prepareInput(input);
  let i = -1;
  let complete;
  while (!complete) {
    complete = dropOneSand(slicedMap);
    i++;
  }
  return i;
};

const step2 = (input) => {
  const slicedMap = prepareInput(input);
  slicedMap.push(
    Array.from(Array(slicedMap[0].length)).fill("."),
    Array.from(Array(slicedMap[0].length)).fill("#")
  );
  let i = 0;
  let complete;
  while (!complete) {
    complete = dropOneSand(slicedMap, true);
    i++;
  }
  return i;
};
//for a nice output
const visualOutput = (slicedMap) =>
  slicedMap.map((line, idx) => (idx ? line.join("") : line)).join("\n");
console.log(step1(input));
console.log(step2(input));
