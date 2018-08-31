#!/usr/bin/env node

const Core = require ("@amory/core")
const mergeJSON = require ("@amory/merge-json")
const cosmiconfig = require ("cosmiconfig")
const { unlinkSync, writeFileSync } = require ("fs")
const { resolve } = require ("path")

const config = cosmiconfig ("amory")

const defaults = {
  "amory": {
    "apis": [],
    "plugins": []
  },
  "dependencies": {
    "@amory/core": "latest",
    "@amory/files": "latest",
    "create-amory": "latest"
  },
  "license": "(Apache-2.0 OR MIT)",
  "scripts": {
    "start": "amory"
  }
}

const result = config.searchSync ()

if (result === null) {
  const dest = resolve ("package.json")
  const src = resolve (".defaults.json")

  writeFileSync (src, JSON.stringify (defaults), "utf8")
  mergeJSON (dest, [src])
  unlinkSync (src)
}

config.clearCaches ()

let { apis, plugins } = config.searchSync ()

apis =
  !Array.isArray (apis) || !apis.length
    ? ["setConfig", "setDefaults", "runProcess"]
    : apis

plugins =
  !Array.isArray (plugins) || !plugins.length
    ? ["@amory/files"]
    : plugins

plugins = plugins.map ((plugin) => require (plugin))

new Core ({ apis, plugins }).run ()
