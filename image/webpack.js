const Config = require ("webpack-chain")

module.exports = ({
  config = new Config ()
}) =>
  /* eslint-disable indent */
  config
    .module
      .rule ("image")
      .test (/\.(gif|jpe?g|png|webp)$/)
      .use ("image")
      .loader ("@amory/image")
      .end ()
