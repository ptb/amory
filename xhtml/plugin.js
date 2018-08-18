const nodePath = require ("path")
const vm2 = require ("vm2")
const webpackSources = require ("webpack-sources")

const layout = require ("./layout.js")
const routes = require ("./routes.js")

/* eslint max-statements: off */

module.exports = class {
  constructor (opts = {}) {
    this.entry = opts.entry || "index.js"
    this.index = opts.index || "index.html"
    this.layout = opts.layout || layout
    this.paths = opts.paths || [""]
    this.plugin = "AmoryXHTMLPlugin"
    this.regex = opts.regex || /\.(html?)$/
    this.routes = opts.routes || routes
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap (this.plugin, (compilation) => {
      compilation.hooks.additionalAssets.tapAsync (this.plugin, (done) => {
        try {
          const source = compilation.assets[this.entry].source ()

          let asset = new vm2.NodeVM ().run (source)

          asset = Object.prototype.hasOwnProperty.call (asset, "default")
            ? asset.default
            : asset

          const stats = compilation.getStats ().toJson ()
          const assets = new Map (
            Object.entries (stats.assetsByChunkName).map (([chunk, file]) => [
              chunk,
              nodePath.join (
                `${compilation.options.output.publicPath || ""}`,
                Array.isArray (file) ? file[0] : file
              )
            ])
          )

          const locals = {
            asset,
            assets,
            compilation,
            "paths": this.paths,
            stats
          };

          [this.paths, this.routes (asset (locals, false))].map ((paths) =>
            this.render ({ ... locals, paths }))

          done ()
        } catch ({ stack }) {
          compilation.errors.push (stack)
          done ()
        }
      })
    })
  }

  render ({ asset, assets, compilation, paths, stats }) {
    paths
      .map ((p) => (this.regex.test (p) ? p : nodePath.join (p, this.index)))
      .filter ((path) => !compilation.assets[path])
      .forEach ((path) => {
        const content = this.layout ({ "body": asset ({ assets, path, stats }, true) })

        compilation.assets[path] = new webpackSources.RawSource (content)
      })
  }
}
