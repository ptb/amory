import merge from "@amory/merge"
import CleanWebpackPlugin from "clean-webpack-plugin"
import Config from "webpack-chain"

export default ({
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
          "root": config.get ("context"),
          "watch": true
        })
      ])
      .end ()
