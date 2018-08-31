#!/usr/bin/env node

const Core = require ("@amory/core")
const mergeJSON = require ("@amory/merge-json")
const cosmiconfig = require ("cosmiconfig")
const { unlinkSync, writeFileSync } = require ("fs")
const { resolve } = require ("path")

const cosmic = cosmiconfig ("amory")

const result = cosmic.searchSync ()

if (result === null) {
  const tmp = resolve ("tmp.json");

  [
    {
      "dest": "package.json",
      "json": {
        "amory": { "apis": [], "plugins": [] },
        "dependencies": {
          "@amory/core": "latest",
          "@amory/files": "latest",
          "@amory/webpack": "latest",
          "create-amory": "latest"
        },
        "license": "(Apache-2.0 OR MIT)",
        "scripts": {
          "start": "amory"
        }
      }
    },
    {
      "dest": ".vscode/launch.json",
      "json": {
        "configurations": [
          {
            "args": [],
            "autoAttachChildProcesses": true,
            "cwd": "${workspaceRoot}",
            "env": { "NODE_ENV": "production" },
            "name": "Amory",
            "program": "/usr/local/bin/amory",
            "request": "launch",
            "type": "node"
          }
        ],
        "version": "0.2.0"
      }
    }
  ].map (({ dest, json }) => {
    writeFileSync (tmp, JSON.stringify (json), "utf8")
    mergeJSON (dest, [tmp])
    unlinkSync (tmp)
  })
}

cosmic.clearCaches ()

const { config } = cosmic.searchSync ()

const apis =
  !Array.isArray (config.apis) || !config.apis.length
    ? ["setConfig", "setDefaults", "runProcess"]
    : config.apis

let plugins =
  !Array.isArray (config.plugins) || !config.plugins.length
    ? ["@amory/files", "@amory/webpack"]
    : config.plugins

plugins = plugins.map ((plugin) => require (plugin))

new Core ({ apis, plugins }).run ()
