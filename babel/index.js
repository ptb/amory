const merge = require ("deepmerge")

module.exports = (config, esm = false) =>
  config.module
    .rule ("babel")
    .test (/\.jsx?$/)
    .exclude.add (/node_modules/)
    .end ()
    .use ("babel")
    .loader (require.resolve ("babel-loader"))
    .tap ((options = {}) =>
      merge (options, {
        "plugins": [
          require.resolve ("@babel/plugin-syntax-dynamic-import"),
          [
            require.resolve ("@babel/plugin-transform-runtime"),
            {
              "useBuiltIns": true,
              "useESModules": esm
            }
          ]
        ],
        "presets": [
          [
            require.resolve ("@babel/preset-env"),
            {
              "modules": false,
              "shippedProposals": true,
              "spec": true,
              "targets": {
                "esmodules": esm
              },
              "useBuiltIns": "usage"
            }
          ]
        ]
      }))
