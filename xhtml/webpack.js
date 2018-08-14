const merge = require ("@amory/merge")
const AmoryScrubPlugin = require ("@amory/scrub/plugin")
const AmoryXHTMLPlugin = require ("@amory/xhtml/plugin")
const HtmlWebpackPlugin = require ("html-webpack-plugin")
const nodeDir = require ("node-dir")
const path = require ("path")
const Config = require ("webpack-chain")

module.exports = ({
  config = new Config (),
  define = {}
}) =>
  /* eslint-disable indent */
  config.when (
    define.stage === "xhtml",

    () =>
      config
        .output
          .libraryTarget ("commonjs2")
          .end ()
        .plugin ("xhtml")
          .use (AmoryXHTMLPlugin)
          .end ()
        .plugin ("scrub")
          .use (AmoryScrubPlugin)
          .after ("xhtml")
          .end (),

    () => {
      const dir = config.output.get ("path")

      nodeDir
        .files (dir, { "sync": true })
        .filter ((asset) => (/\.(html?)$/).test (asset))
        .forEach ((asset) =>
          config
            .plugin (asset)
              .use (HtmlWebpackPlugin)
              .tap ((options = {}) => [
                merge (options, {
                  "cache": false,
                  "filename": path.relative (dir, asset),
                  "minify": {
                    "collapseWhitespace": true,
                    "keepClosingSlash": true,
                    "preserveLineBreaks": true
                  },
                  "template": asset,
                  "title": null,
                  "xhtml": true
                })
              ])
              .end ())

      return config
    }
  )
