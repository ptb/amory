const { join } = require ("path").posix
const { Children, "createElement": h } = require ("react")
const { renderToStaticMarkup } = require ("react-dom/server")
const { NodeVM } = require ("vm2")
const { RawSource } = require ("webpack-sources")

const dest = (config) =>
  join (
    config.get ("context"),
    config.get ("mode") === "development" ? "dev" : "web"
  )

const layout = (content) =>
  `<!DOCTYPE html>${renderToStaticMarkup (
    h ("html", { "lang": "en", "xmlns": "http://www.w3.org/1999/xhtml" }, [
      h ("head", { "key": "head" }, [
        h ("meta", { "charset": "utf-8", "key": "charset" }),
        h ("meta", {
          "content": "initial-scale=1,width=device-width",
          "key": "viewport",
          "name": "viewport"
        }),
        h ("title", { "key": "title" }, "\u00a0")
      ]),
      h ("body", {
        "dangerouslySetInnerHTML": { "__html": content },
        "id": "root",
        "key": "body"
      })
    ])
  )}`

const routes = (content, prefix = "") =>
  (content.props
    ? [
      ... new Set (
        Children.map (content, ({ "props": { children, path = "" } }) => [
          prefix || path ? join (prefix, path) : null,
          children ? routes (children, join (prefix, path)) : null
        ]).filter ((path) => !(/:|\*/).test (path))
      )
    ]
    : [])

class AmorySSRPlugin {
  constructor (opts = {}) {
    this.entry = opts.entry || "index.js"
    this.index = opts.index || "index.html"
    this.layout = opts.layout || layout
    this.paths = opts.paths || [""]
    this.plugin = "AmorySSRPlugin"
    this.regex = opts.regex || /\.(html?)$/
    this.routes = opts.routes || routes
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap (this.plugin, (compilation) => {
      compilation.hooks.additionalAssets.tapAsync (this.plugin, (done) => {
        try {
          const source = compilation.assets[this.entry].source ()
          const asset = new NodeVM ().run (source).default
          const stats = compilation.getStats ().toJson ()
          const assets = new Map (
            Object.entries (stats.assetsByChunkName).map (([chunk, file]) => [
              chunk,
              join (
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

      compilation.hooks.optimizeAssets.tapAsync (
        this.plugin,
        (assets, done) => {
          try {
            Object.keys (assets).forEach ((key) => {
              if (
                Object.prototype.hasOwnProperty.call (assets, key) &&
                assets[key] !== null &&
                !this.regex.test (key)
              ) {
                delete assets[key]
              }
            })

            done ()
          } catch ({ stack }) {
            compilation.errors.push (stack)
            done ()
          }
        }
      )
    })
  }

  render ({ asset, assets, compilation, paths, stats }) {
    paths
      .map ((p) => (this.regex.test (p) ? p : join (p, this.index)))
      .filter ((path) => !compilation.assets[path])
      .forEach ((path) => {
        const content = this.layout (asset ({ assets, path, stats }, true))

        compilation.assets[path] = new RawSource (content)
      })
  }
}

/* eslint-disable indent */
module.exports = (config) =>
  config
    .entry ("index")
      .add (join (config.get ("context"), "src", "index.js"))
      .end ()
    .output
      .libraryTarget ("commonjs2")
      .path (dest (config))
      .end ()
    .plugin ("ssr")
      .use (AmorySSRPlugin)
      .end ()
