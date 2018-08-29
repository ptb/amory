#!/usr/bin/env node

const Core = require ("@amory/core")
const mergeJSON = require ("@amory/merge-json")
const cosmiconfig = require ("cosmiconfig")
const { resolve } = require ("path")

const config = cosmiconfig ("amory")

config.search ().then ((result) => {
  if (result === null) {
    const dest = resolve ("../../../package.json")
    const srcs = resolve ("./defaults.json")

    mergeJSON (dest, [srcs])
  }
})

config.clearCaches ()

config.search ().then ((result) => {
  const plugins = result.config.plugins.map ((plugin) => require (plugin))

  new Core ({ plugins }).run ()
})
