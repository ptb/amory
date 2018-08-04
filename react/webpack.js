const merge = require ("@amory/merge")

module.exports = (config) =>
  config.module
    .rule ("babel")
    .test (/\.m?jsx?$/)
    .exclude.add (/node_modules/)
    .end ()
    .use ("babel")
    .loader (require.resolve ("babel-loader"))
    .tap ((options = {}) =>
      merge (options, {
        "presets": [
          require.resolve ("@babel/preset-react")
        ]
      }))
