const AmoryScrubPlugin = require ("@amory/scrub")
const AmoryXHTMLPlugin = require ("@amory/xhtml")
const Config = require ("webpack-chain")

module.exports = ({
  config = new Config ()
}) =>
  /* eslint-disable indent */
  config
    .output
      .libraryTarget ("commonjs2")
      .end ()
    .plugin ("xhtml")
      .use (AmoryXHTMLPlugin)
      .end ()
    .plugin ("exclude")
      .use (AmoryScrubPlugin)
      .after ("xhtml")
      .end ()
