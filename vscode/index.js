const mergeJSON = require ("@amory/merge-json")
const { ensureDir, unlinkSync, writeFileSync } = require ("fs-extra")
const { dirname, resolve } = require ("path")

const addVSCodeDebug = () => {
  const tmp = resolve ("tmp.json");

  [
    {
      "dest": ".vscode/launch.json",
      "json": {
        "configurations": [
          {
            "args": [],
            "autoAttachChildProcesses": true,
            "cwd": "${workspaceRoot}",
            "env": {
              "DEBUG": "@amory:*",
              "NODE_ENV": "production"
            },
            "name": "Amory",
            "program": "${workspaceRoot}/node_modules/.bin/amory",
            "request": "launch",
            "type": "node"
          }
        ],
        "version": "0.2.0"
      }
    }
  ].map (({ dest, json }) => {
    writeFileSync (tmp, JSON.stringify (json), "utf8")
    ensureDir (dirname (dest))
    mergeJSON (dest, [tmp])
    unlinkSync (tmp)
  })
}

module.exports = {
  "name": "@amory/vscode",
  "setDefaults": addVSCodeDebug
}
