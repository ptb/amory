const merge = require ("@amory/merge")
const CleanWebpackPlugin = require ("clean-webpack-plugin")
const Config = require ("webpack-chain")

module.exports = ({
  config = new Config ()
}) =>
  /* eslint-disable indent */
  config
    .plugin ("clean")
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
      .end ()
