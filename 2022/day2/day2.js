const { readFileSync } = require("fs");
const { resolve } = require("path");
function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/\r?\n/);

  return arr;
}
const output = syncReadFile("./day2.txt");
console.log(output);

const scoresForOutcome = {
  winning: 6,
  loosing: 0,
  draw: 3,
};

const scoresForChosenStrategy = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const winning = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

const mappingTemplate = {
  A: "rock",
  B: "paper",
  C: "scissors",
  X: "rock",
  Y: "paper",
  Z: "scissors",
};

const step2MappingTemplate = {
  ...mappingTemplate,
  X: "loosing",
  Y: "draw",
  Z: "winning",
};

const step1 = output
  .map((value) => value.split(" ").map((value) => mappingTemplate[value]))
  .map((value) => {
    const firstElf = value[0];
    const secondElf = value[1];
    if (winning[firstElf] === secondElf) {
      // first elf wins
      return scoresForChosenStrategy[secondElf] + scoresForOutcome.loosing;
    } else if (winning[secondElf] === firstElf) {
      // You win / second elf wins
      return scoresForChosenStrategy[secondElf] + scoresForOutcome.winning;
    } else {
      //draw
      return scoresForChosenStrategy[secondElf] + scoresForOutcome.draw;
    }
  })
  .reduce((a, b) => a + b, 0);

console.log(step1);

const step2 = output
  .map((value) => value.split(" ").map((value) => step2MappingTemplate[value]))
  .map((value) => {
    const firstElf = value[0];
    const outcome = value[1];
    if (outcome === "winning") {
      const yourPlay = winning[winning[firstElf]];
      return scoresForChosenStrategy[yourPlay] + scoresForOutcome[outcome];
    } else if (outcome === "loosing") {
      const yourPlay = winning[firstElf];
      return scoresForChosenStrategy[yourPlay] + scoresForOutcome[outcome];
    } else {
      const yourPlay = firstElf;
      return scoresForChosenStrategy[yourPlay] + scoresForOutcome[outcome];
    }
  })
  .reduce((a, b) => a + b, 0);

console.log(step2);
