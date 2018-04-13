const fs = require ("fs-extra")

exports.createFilePath = require ("./create-file-path.js")
exports.createRemoteFileNode = require ("./create-remote-file-node.js")
exports.loadNodeContent = (file) => fs.readFile (file.absolutePath, "utf-8")
