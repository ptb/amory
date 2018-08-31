#!/usr/bin/env node

const Core = require ("@amory/core")
const mergeJSON = require ("@amory/merge-json")
const cosmiconfig = require ("cosmiconfig")
const { ensureDir, unlinkSync, writeFileSync } = require ("fs-extra")
const { dirname, resolve } = require ("path")

const amory = {
  "apis": ["setConfig", "setDefaults", "runProcess"],
  "plugins": [
    "@amory/files",
    "@amory/plugin",
    "@amory/vscode",
    "@amory/webpack"
  ]
}

const cosmic = cosmiconfig ("amory")

const result = cosmic.searchSync ()

if (result === null) {
  const tmp = resolve ("tmp.json");

  [
    {
      "dest": "package.json",
      "json": {
        "amory": amory,
        "dependencies": {
          "@amory/core": "latest",
          "@amory/files": "latest",
          "@amory/plugin": "latest",
          "@amory/vscode": "latest",
          "@amory/webpack": "latest",
          "create-amory": "latest"
        },
        "license": "(Apache-2.0 OR MIT)",
        "scripts": {
          "start": "amory"
        }
      }
    }
  ].map (({ dest, json }) => {
    writeFileSync (tmp, JSON.stringify (json), "utf8")
    ensureDir (dirname (dest))
    mergeJSON (dest, [tmp])
    unlinkSync (tmp)
  })
}

cosmic.clearCaches ()

const { config } = cosmic.searchSync ()

const apis =
  !Array.isArray (config.apis) || !config.apis.length
    ? amory.apis
    : config.apis

let plugins =
  !Array.isArray (config.plugins) || !config.plugins.length
    ? amory.plugins
    : config.plugins

plugins = plugins.map ((plugin) => require (plugin))

new Core ({ apis, plugins }).run ()
