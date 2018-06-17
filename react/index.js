const merge = require ("deepmerge")

module.exports = (config) =>
  config.module
    .rule ("babel")
    .test (/\.jsx?$/)
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
