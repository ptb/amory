const CleanWebpackPlugin = require ("clean-webpack-plugin")
const merge = require ("deepmerge")

module.exports = (config) =>
  config
    .plugin ("clean")
    .use (CleanWebpackPlugin)
    .tap ((options = []) => [
      merge (options, config.output.get ("path"))
    ])
