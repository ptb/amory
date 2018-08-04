const AmoryExcludePlugin = require ("@amory/exclude")
const AmorySSRPlugin = require ("@amory/ssr")
const Config = require ("webpack-chain")

module.exports = ({
  config = new Config ()
}) =>
  /* eslint-disable indent */
  config
    .output.libraryTarget ("commonjs2")
    .plugin ("xhtml")
      .use (AmorySSRPlugin)
      .end ()
    .plugin ("exclude")
      .use (AmoryExcludePlugin)
      .after ("xhtml")
      .end ()
