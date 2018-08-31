const merge = require ("@amory/merge")
const Config = require ("webpack-chain")

const AmoryPlugin = require ("./plugin.js")

const addAmoryPlugin = ({
  define = {},
  plugins = [],
  "webpack": config = new Config ()
}) =>
  /* eslint-disable indent */
  config
    .plugin ("amory")
      .use (AmoryPlugin)
      .tap ((options = []) => merge (options, [{ define, plugins }]))
      .end ()

module.exports = {
  "name": "@amory/plugin",
  "setConfig": addAmoryPlugin
}
