#!/usr/bin/env node

const cosmiconfig = require ("cosmiconfig")
const pEachSeries = require ("p-each-series")
const { AsyncSeriesHook } = require ("tapable")
const Config = require ("webpack-chain")

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
        async (plugin) =>
          plugin[api] &&
          this.hooks[api].tap (
            plugin.name,
            await plugin[api] ({ ... options, ... this }, plugin.options)
          )
      ))
  }
}

if (require.main === module) {
  try {
    const { config } = cosmiconfig ("amory").searchSync ()

    const apis = config.apis
    const plugins = config.plugins.map ((plugin) => require (plugin));

    ["markup", "script"].map ((stage) => {
      const define = { stage }

      return new AmoryCore ({ apis, define, plugins }).run ()
    })
  } catch (error) {
    switch (error.toString ()) {
      case "TypeError: Cannot destructure property `config` of 'undefined' or 'null'.":
        console.error (`Add configuration to "package.json":\n\n  "amory": { "apis": [], "plugins": [] },\n`)
        break
      default:
        console.error (error)
        break
    }
  }
}

module.exports = AmoryCore
