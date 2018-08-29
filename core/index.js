const { actions, client } = require ("@amory/schema")
const pEachSeries = require ("p-each-series")
const { Tapable, AsyncSeriesHook } = require ("tapable")

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
  }

  run () {
    pEachSeries (apis, (api) =>
      pEachSeries (
        this.plugins,
        async (plugin) =>
          plugin[api] &&
          this.hooks[api].tap (
            plugin.name,
            await plugin[api] ({ actions, client, ... this }, plugin.options)
          )
      ))
  }
}
