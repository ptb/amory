const merge = require ("@amory/merge")
const CleanWebpackPlugin = require ("clean-webpack-plugin")
const Config = require ("webpack-chain")

module.exports = ({
  config = new Config (),
  define = {}
}) =>
  /* eslint-disable indent */
  config
    .when (
      define.stage === "xhtml",

      () =>
        config
          .plugin ("clean")
            .use (CleanWebpackPlugin)
            .tap ((paths = [], options = {}) => [
              merge (paths, [config.output.get ("path")]),
              merge (options, {
                "root": config.get ("context"),
                "watch": true
              })
            ])
            .end ()
    )
