const fs = require('fs');

const readFile = async (filepath) => {
    const file = fs.readFileSync(filepath);
    return file;
}

module.exports = {
    readFile
}