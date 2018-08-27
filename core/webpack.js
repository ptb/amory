const merge = require ("@amory/merge")
const Config = require ("webpack-chain")

const AmoryCorePlugin = require ("./plugin.js")

module.exports = ({
  config = new Config (),
  plugins = []
}) =>
  /* eslint-disable indent */
  config
    .plugin ("amory")
      .use (AmoryCorePlugin)
      .tap ((options = []) => merge (options, [{ plugins }]))
      .end ()
