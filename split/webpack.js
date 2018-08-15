const Config = require ("webpack-chain")

module.exports = ({
  config = new Config (),
  define = {}
}) =>
  /* eslint-disable indent */
  config
    .when (
      define.stage !== "xhtml",

      () =>
        config
          .optimization
            .splitChunks ({
              "cacheGroups": {
                "react": {
                  "chunks": "all",
                  "name": "react",
                  "test": /react/
                }
              }
            })
            .end ()
    )
