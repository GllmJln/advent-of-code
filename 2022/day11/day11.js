import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function syncReadFile(filename) {
  const contents = readFileSync(resolve(__dirname, filename), "utf-8");

  const arr = contents.split(/Monkey/).slice(1);

  return arr;
}

const formatInput = (input) => {
  return input.map((entry) =>
    entry
      .split("\n")
      .filter((value) => value)
      .map((value) =>
        value
          .trim()
          .split(":")
          .filter((value) => value)
      )
      .reduce((prev, curr) => {
        const splitOrNoSplit =
          curr[0] === "Starting items"
            ? curr[1].split(",").map((item) => +item)
            : curr[1];
        return curr.length === 1
          ? Object.assign(prev, { number: curr[0] })
          : Object.assign(prev, { [curr[0]]: splitOrNoSplit });
      }, {})
  );
};

const getDividers = (monkeys) =>
  monkeys.map((monkey) => +monkey.Test.split("y ")[1]);

const newWorryLevel = (operation, worryLevel, divideByThree = true) => {
  //Never use eval, security issues
  const applyOperation = eval(
    `let newWorry = ${worryLevel}; ${operation
      .replace("new", "newWorry")
      .replace(/old/g, "newWorry")}`
  );
  return divideByThree ? Math.floor(applyOperation / 3) : applyOperation;
};

const calculateInitialRemainders = (monkeys) => {
  const dividers = getDividers(monkeys);
  monkeys.forEach((monkey) => {
    monkey["Starting items"] = monkey["Starting items"].map((item) =>
      dividers.map((divider) => item % divider)
    );
  });
};

const calculateRemainders = (dividers, item, operation) => {
  const calculateNewTestRemainders = item.map((previousRemainder) =>
    newWorryLevel(operation, previousRemainder, false)
  );
  return calculateNewTestRemainders.map(
    (testRemainder, idx) => testRemainder % dividers[idx]
  );
};

// There is probably a way of doing step 1 with the remainders but only so much refactoring I can handle.
// Also I think the Math.floor might break it, since it's not a "known" output.
const executeOneRound = (monkeys, divideByThree) => {
  const dividers = getDividers(monkeys);
  monkeys.forEach((monkey) => {
    monkey["Starting items"].forEach((item) => {
      monkey.inspected = monkey.inspected ? monkey.inspected + 1 : 1;
      const worryLevels = divideByThree
        ? newWorryLevel(monkey.Operation, item)
        : calculateRemainders(dividers, item, monkey.Operation);
      const evaluateThrow = divideByThree
        ? worryLevels % +monkey.Test.split("y ")[1]
        : worryLevels[+monkey.number];
      const throwToMonkey =
        monkey[evaluateThrow === 0 ? "If true" : "If false"].split("y ")[1];
      monkeys[+throwToMonkey]["Starting items"].push(worryLevels);
    });
    monkey["Starting items"] = []; // monkeys never keep item
  });
};

const makeRounds = (rounds, input, divideByThree) => {
  for (let i = 0; i < rounds; i++) {
    executeOneRound(input, divideByThree);
  }
};

const getTopTwoAndMultiplyTogether = (solved) => {
  return solved
    .map((monkey) => monkey.inspected)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((prev, curr) => prev * curr);
};

const formatAndExecuteRounds = (input, rounds, divideByThree) => {
  const formattedInput = formatInput(input);
  !divideByThree && calculateInitialRemainders(formattedInput);
  makeRounds(rounds, formattedInput, divideByThree);
  return getTopTwoAndMultiplyTogether(formattedInput);
};

export const step1 = (input) => formatAndExecuteRounds(input, 20, true);
export const step2 = (input) => formatAndExecuteRounds(input, 10000, false);

const input = syncReadFile("./day11.txt");
console.log(step1(input));
console.log(step2(input));
