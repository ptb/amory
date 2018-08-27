const Config = require ("webpack-chain")

const AmoryCorePlugin = require ("./plugin.js")

module.exports = ({
  config = new Config ()
}) =>
  /* eslint-disable indent */
  config
    .plugin ("amory")
      .use (AmoryCorePlugin)
      .end ()
