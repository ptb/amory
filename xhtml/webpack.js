const merge = require ("@amory/merge")
const AmoryScrubPlugin = require ("@amory/scrub/plugin")
const AmoryXHTMLPlugin = require ("@amory/xhtml/plugin")
const HtmlWebpackPlugin = require ("html-webpack-plugin")
const nodeDir = require ("node-dir")
const nodePath = require ("path")
const Config = require ("webpack-chain")

module.exports = ({
  config = new Config (),
  define = {}
}) =>
  /* eslint-disable indent */
  config.when (
    define.stage === "xhtml",

    (stage) =>
      stage
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

    (stage) => {
      const dir = stage.output.get ("path")

      nodeDir
        .files (dir, { "sync": true })
        .filter ((asset) => (/\.(html?)$/).test (asset))
        .forEach ((asset) =>
          stage
            .plugin (asset)
              .use (HtmlWebpackPlugin)
              .tap ((options = {}) => [
                merge (options, {
                  "filename": nodePath.relative (dir, asset),
                  "minify": {
                    "collapseWhitespace": true,
                    "keepClosingSlash": true,
                    "preserveLineBreaks": true
                  },
                  "template": asset,
                  "xhtml": true
                })
              ])
              .end ())

      return stage
    }
  )
