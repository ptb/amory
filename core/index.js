const pEachSeries = require ("p-each-series")
const { Tapable, AsyncSeriesHook } = require ("tapable")
const Config = require ("webpack-chain")

const apis = ["setConfig"]

module.exports = class extends Tapable {
  constructor (options = {}) {
    super (options)

    this.hooks = apis.reduce ((hooks, api) => {
      hooks[api] = new AsyncSeriesHook (["params", "options"])
      return hooks
    }, {})

    this.name = "AmoryCore"
    this.plugins = options.plugins || []
    this.webpack = new Config ()
  }

  run ({ define, mode }) {
    pEachSeries (apis, (api) =>
      pEachSeries (
        this.plugins,
        async (plugin) =>
          plugin[api] &&
          this.hooks[api].tap (
            plugin.name,
            await plugin[api] ({ define, mode, ... this }, plugin.options)
          )
      ))
  }
}
