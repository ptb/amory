const merge = require ("@amory/merge")
const Config = require ("webpack-chain")

module.exports = ({
  config = new Config ()
}) =>
  /* eslint-disable indent */
  config
    .merge ({
      "optimization": {
        "splitChunks": {
          "cacheGroups": {
            "react": {
              "chunks": "all",
              "name": "react",
              "test": /react/
            }
          }
        }
      }
    })
    .module
      .rule ("babel")
        .test (/\.m?jsx?$/)
        .exclude
          .add (/node_modules/)
          .end ()
        .use ("babel")
          .loader (require.resolve ("babel-loader"))
          .tap ((options = {}) =>
            merge (options, {
              "presets": [
                require.resolve ("@babel/preset-react")
              ]
            }))
