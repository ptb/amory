#!/usr/bin/env node

const cosmiconfig = require ("cosmiconfig")
const pEachSeries = require ("p-each-series")
const { AsyncSeriesHook } = require ("tapable")
const Config = require ("webpack-chain")

const onError = (error) => {
  switch (error.toString ()) {
    case "Error: Invalid arguments to tap(options: Object, fn: function)":
      console.error (`Export a "name" property from each plugin.\n`)
      break
    case "TypeError: Cannot destructure property `config` of 'undefined' or 'null'.":
      console.error (`Add to "package.json":\n\n  "amory": { "apis": [], "plugins": [] },\n`)
      break
    default:
      console.error (error)
      break
  }
}

class AmoryCore {
  constructor (options = {}) {
    this.apis = options.apis || []
    this.define = options.define || {}
    this.hooks = this.apis.reduce ((hooks, api) => {
      hooks[api] = new AsyncSeriesHook (["params", "options"])
      return hooks
    }, {})
    this.name = "@amory/core"
    this.plugins = options.plugins || []
    this.webpack = new Config ()
  }

  run (options) {
    pEachSeries (this.apis, (api) =>
      pEachSeries (
        this.plugins,
        async (plugin) => {
          try {
            plugin[api] &&
            this.hooks[api].tap (
              plugin.name,
              await plugin[api] ({ ... options, ... this }, plugin.options)
            )
          } catch (error) {
            onError (error)
          }
        }
      ))
  }
}

if (require.main === module) {
  try {
    const { config } = cosmiconfig ("amory").searchSync ()

    const apis = config.apis
    const plugins = config.plugins.map ((plugin) => require (plugin))
    const stages = config.stages || ["main"]

    stages.map ((stage) =>
      new AmoryCore ({ apis, "define": { stage }, plugins }).run ())
  } catch (error) {
    onError (error)
  }
}

module.exports = AmoryCore
