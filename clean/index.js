const CleanWebpackPlugin = require ("clean-webpack-plugin")
const merge = require ("deepmerge")

module.exports = (config) =>
  config
    .plugin ("clean")
    .before ("ssr")
    .use (CleanWebpackPlugin)
    .tap ((paths = [], options = {}) => [
      merge (paths, [
        config.output.get ("path")
      ]),
      merge (options, {
        "allowExternal": true,
        "root": config.output.get ("context"),
        "watch": true
      })
    ])
