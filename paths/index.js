const merge = require ("@amory/merge")
const HtmlWebpackPlugin = require ("html-webpack-plugin")
const nodeDir = require ("node-dir")
const { join, relative } = require ("path").posix
const Config = require ("webpack-chain")

module.exports = ({
  config = new Config ()
}) => {
  const dir = config.output.get ("path")

  nodeDir
    .files (dir, { "sync": true })
    .filter ((asset) => (/\.(html?)$/).test (asset))
    .forEach ((asset) =>
      /* eslint-disable indent */
      config
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
