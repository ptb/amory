const merge = require ("deepmerge")
const HtmlWebpackPlugin = require ("html-webpack-plugin")
const nodeDir = require ("node-dir")
const { join, relative } = require ("path").posix

module.exports = (config) => {
  const dir = config.output.get ("path")

  nodeDir
    .files (dir, { "sync": true })
    .filter ((asset) => (/\.(html?)$/).test (asset))
    .forEach ((asset) =>
      /* eslint-disable indent */
      config
        .entry ("index")
          .add (join (config.get ("context"), "src", "index.js"))
          .end ()
        .output
          .filename (join ("js", "[name]-[contenthash:6].js"))
          .end ()
        .plugin (asset)
          .use (HtmlWebpackPlugin)
          .tap ((options = {}) => [
            merge (options, {
              "filename": relative (dir, asset),
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

  return config
}
