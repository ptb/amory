const merge = require('@amory/merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Config = require('webpack-chain');

const webpack = ({
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
      .end ();

module.exports = webpack;
