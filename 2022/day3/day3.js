const { readFileSync } = require("fs");
const { resolve } = require("path");
function syncReadFile(filename) {
    const contents = readFileSync(resolve(__dirname, filename), "utf-8");

    const arr = contents.split(/\r?\n/);

    return arr;
}
const output = syncReadFile("./day3.txt");
console.log(output);


const alphabet = "abcdefghijklmnopqrstuvwxyz"
const isUpperCase = (value) => {
    return value.toUpperCase() === value
}


const step1 = output.map(value =>
    [value.slice(0, (value.length) / 2), value.slice(value.length / 2)]
)
    .map(value => value.map(nestedValue => nestedValue.split("").find(findValue => value[0].includes(findValue) && value[1].includes(findValue))))
    .map(value => value[0])
    .map(value => alphabet.indexOf(value.toLowerCase()) + (isUpperCase(value) ? 27 : 1)).reduce((a, b) => a + b)


const step2 = output
    .reduce((previous, _, index) => index % 3 === 0 ? [...previous, output.slice(index, index + 3)] : previous, [])
    .map(value => value.map(nestedValue => nestedValue.split("").find(findValue => value[0].includes(findValue) && value[1].includes(findValue) && value[2].includes(findValue))))
    .map(value => value[0])
    .map(value => alphabet.indexOf(value.toLowerCase()) + (isUpperCase(value) ? 27 : 1)).reduce((a, b) => a + b)

console.log(step1)
console.log(step2)
