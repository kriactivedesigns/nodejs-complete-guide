const fs = require('fs');
const pathHelper = require('../util/path');

const deleteFile = (filePath) => {
    fs.unlink(pathHelper.path.join(pathHelper.rootDir, filePath), (err) => {
        if(err) {
            throw err
        }
    })
}

module.exports = {
    deleteFile
}