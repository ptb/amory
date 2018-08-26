const pEachSeries = require ("p-each-series")
const { AsyncSeriesHook } = require ("tapable")

const apis = [
  "setProgram",
  "setConfig",
  "deleteFiles",
  "createSchema",
  "addGQLFields",
  "sourceNodes",
  "processNodes",
  "createPages",
  "loadQueries",
  "runQueries",
  "wrapPageElement",
  "wrapRootElement",
  "replaceRenderer",
  "renderMarkup",
  "postRenderMarkup",
  "savePageData",
  "saveSiteData",
  "saveRedirects"
]

module.exports = class {
  constructor (options = {}) {
    this.hooks = apis.reduce ((target, api) => {
      target[api] = new AsyncSeriesHook (["params", "options"])
      return target
    }, {})
    this.name = "AmoryCorePlugin"
    this.plugins = options.plugins || []
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap (this.name, (compilation) => {
      compilation.hooks.additionalAssets.tapAsync (
        this.name,
        async (done) => {
          try {
            await pEachSeries (apis, (api) =>
              pEachSeries (
                this.plugins,
                async (plugin) =>
                  plugin[api] &&
                  this.hooks[api].tap (
                    plugin.name,
                    await plugin[api] (
                      { compilation, compiler, ... this },
                      plugin.options
                    )
                  )
              ))
            done ()
          } catch ({ stack }) {
            compilation.errors.push (stack)
            done ()
          }
        }
      )
    })
  }
}
