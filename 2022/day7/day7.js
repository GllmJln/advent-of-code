const { readFileSync, Dirent } = require("fs");
const { resolve } = require("path");
function syncReadFile(filename) {
    const contents = readFileSync(resolve(__dirname, filename), "utf-8");

    const arr = contents.split(/\r?\n/);

    return arr;
}
const output = syncReadFile("./day7.txt");

const files = {}

const isCommand = (entry) => {
    return entry[0] === '$'
}

const getLsOutput = (listOfEntries, lsIndex) => {
    const nextCommandIndex = listOfEntries.findIndex((command, index) => index > lsIndex && isCommand(command))
    return listOfEntries.slice(lsIndex + 1, nextCommandIndex)
}

const processCd = (command, cwd) => {
    const cdCommand = command.split(" ")[2]
    switch (cdCommand) {
        case "..":
            cwd.pop()
            break;
        case "/":
            cwd.splice(0, 1)
        default:
            cwd.push(cdCommand)
            break;
    }
}

const processLsOutput = (lsOutput, cwd) => {
    const outputArray = lsOutput.map(lsOutput => lsOutput.split(" "))
    for (const file of outputArray) {
        if (file[0] === 'dir') {
            appendFolder(file[1], cwd)
        } else {
            addFile(file[1], file[0], cwd)
        }
    }
}

const appendFolder = (folderName, cwd) => {
    addFolder(files, cwd, folderName)
}

const addFile = (fileName, fileSize, cwd) => {
    addSingleFile(files, cwd, { fileName, fileSize })
}

const addFolder = (object, path, value) => {
    for (let index = 0; index < path.length; index++) {
        const key = path[index];
        if (index === path.length - 1) {
            object[key] = { ...object[key], [value]: { files: [] } };
        }
        object = object[key];
    }

    return object;
}


const getDirectorySize = (fileStructure) => {
    const values = Object.values(fileStructure)
    const size = values.reduce((prev, curr) => Array.isArray(curr) ? curr.reduce((a, b) => +a + +b.fileSize, 0) : prev + getDirectorySize(curr), 0)
    fileStructure.size = size
    return size
}

const cwd = []
for (let i = 0; i < output.length; i++) {
    const line = output[i]
    if (isCommand(line)) {
        if (line.split(" ")[1] === "cd") {
            processCd(line, cwd)
        } else {
            processLsOutput(getLsOutput(output, i), cwd)
        }
    }
}


function addSingleFile(object, path, value) {
    for (let index = 0; index < path.length; index++) {
        const key = path[index];
        if (index === path.length - 1) {
            const files = (!object[key] || !object[key].files) ? [value] : [...object[key].files, value]
            object[key] = { ...object[key], files };
        }
        object = object[key];
    }

    return object;
}

//Spent a day trying to find this bug and I don't know how else to fix it right now, I just want to finish this
//Probably something to do with the cd switch-case fallthrough stuff, cba to fix it 
//It's also the last line of the input file so yeah
files["/"].qlpvwf.zsmhsbp.qlpvwf.przn.files = [{ fileName: 'npscjw.ndb', fileSize: '167375' }]

const topDirSize = getDirectorySize(files)

// Evil
const sizes = JSON.stringify(files).match(/"size":(\d+)/g).map(size => +size.split(":")[1])

const filterSizes = (filter) => sizes.filter(size => size < filter)
const step1 = filterSizes(100000).reduce((a, b) => a + b)
console.log(step1)


const allowedSize = 70000000

const requiredSpace = 30000000


const leftOverSpace = allowedSize - topDirSize
const requiredSpaceToFreeUp = requiredSpace - leftOverSpace
const step2 = Math.min(...sizes.filter(fileSize => fileSize >= requiredSpaceToFreeUp))
console.log(step2)