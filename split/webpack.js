import Config from "webpack-chain"

module.exports = ({
  config = new Config ()
}) =>
  /* eslint-disable indent */
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
