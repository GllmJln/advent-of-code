const { readFileSync, } = require('fs');
function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');

    const arr = contents.split(/\r?\n/);

    return arr;
}
const output = syncReadFile('input-data.txt');
console.log(output)

const scoresForOutcome = {
    winning: 6,
    loosing: 0,
    draw: 3
}

const scoresForChosenStrategy = {
    rock: 1,
    paper: 2,
    scissors: 3
}

const winning = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper"
}

const mappingTemplate = {
    A: "rock",
    B: "paper",
    C: "scissors",
    X: "rock",
    Y: "paper",
    Z: "scissors"
}

const step1 = output
    .map(value => value
        .split(" ")
        .map(value => mappingTemplate[value])
    )
    .map(value => {
        const firstElf = value[0]
        const secondElf = value[1]
        if (winning[firstElf] === secondElf) {
            // first elf wins
            return scoresForChosenStrategy[secondElf] + scoresForOutcome.loosing
        } else if (winning[secondElf] === firstElf) {
            // You win / second elf wins
            return scoresForChosenStrategy[secondElf] + scoresForOutcome.winning
        } else {
            //draw
            return scoresForChosenStrategy[secondElf] + scoresForOutcome.draw
        }
    }
    ).reduce((a, b) => a + b, 0)

console.log(step1)