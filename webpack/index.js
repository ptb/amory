const fork = require ("@amory/fork")
const merge = require ("@amory/merge")
const debug = require ("debug") ("@amory:webpack")
const { resolve } = require ("path").posix
const Config = require ("webpack-chain")

const AmoryCorePlugin = require ("./plugin.js")

const addWebpackConfig = ({
  plugins = [],
  webpack = new Config ()
}) =>
  /* eslint-disable indent */
  webpack
    .plugin ("amory")
      .use (AmoryCorePlugin)
      .tap ((options = []) => merge (options, [{ plugins }]))
      .end ()

const runWebpack = ({ webpack }) => {
  const script = resolve (__dirname, "webpack.js")
  const thread = fork (debug, script)

  thread.send ({ "cmd": "build", "config": webpack.toConfig () })
}

module.exports = {
  "name": "@amory/webpack",
  "runProcess": runWebpack,
  "setConfig": addWebpackConfig
}
