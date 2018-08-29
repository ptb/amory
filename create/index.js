#!/usr/bin/env node

const Core = require ("@amory/core")
const mergeJSON = require ("@amory/merge-json")
const cosmiconfig = require ("cosmiconfig")
const { unlinkSync, writeFileSync } = require ("fs")
const { resolve } = require ("path")

const config = cosmiconfig ("amory")

const defaults = {
  "amory": {
    "plugins": [
      "@amory/files"
    ]
  }
}

config.search ().then ((result) => {
  if (result === null) {
    const dest = resolve ("package.json")
    const src = resolve (".defaults.json")

    writeFileSync (src, JSON.stringify (defaults), "utf8")
    mergeJSON (dest, [src])
    unlinkSync (src)
  }
})

config.clearCaches ()

config.search ().then ((result) => {
  const plugins = result.config.plugins.map ((plugin) => require (plugin))

  new Core ({ plugins }).run ()
})
