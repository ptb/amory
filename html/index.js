const merge = require ("deepmerge")
const HtmlWebpackPlugin = require ("html-webpack-plugin")
const nodeDir = require ("node-dir")
const { relative } = require ("path").posix

module.exports = (config) => {
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
            "filename": relative (dir, asset),
            "minify": {
              "collapseWhitespace": true,
              "keepClosingSlash": true,
              "preserveLineBreaks": true,
              "useShortDoctype": true
            },
            "template": asset,
            "xhtml": true
          })
        ]))

  return config
}
