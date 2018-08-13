import Config from "webpack-chain"

export default ({
  config = new Config ()
}) =>
  /* eslint-disable indent */
  config
    .module
      .rule ("esmod")
        .post ()
        .test (/src\/index\.mjs$/)
        .use ("esmod")
          .loader ("@amory/module")
          .end ()
        .end ()
      .end ()
