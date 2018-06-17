const merge = require ("deepmerge")

module.exports = (config) =>
  config.module
    .rule ("babel")
    .test (/\.jsx?$/)
    .use ("babel")
    .loader (require.resolve ("babel-loader"))
    .tap ((options = {}) =>
      merge (options, {
        "plugins": [
          [
            require.resolve ("babel-plugin-jsx-pragmatic"),
            {
              "export": "createElement",
              "import": "h",
              "module": "react"
            }
          ]
        ],
        "presets": [
          [
            require.resolve ("@babel/preset-react"),
            {
              "pragma": "h"
            }
          ]
        ]
      }))
