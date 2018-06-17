const merge = require ("deepmerge")

module.exports = (config, esm) =>
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
              "useESModules": true
            }
          ]
        ],
        "presets": [
          [
            require.resolve ("@babel/preset-env"),
            {
              "ignoreBrowserslistConfig": true,
              "loose": false,
              "modules": false,
              "shippedProposals": true,
              "spec": true,
              "targets": {
                "browsers": esm
                  ? [
                    "Chrome >= 61",
                    "Edge >= 16",
                    "Firefox >= 60",
                    "iOS >= 11",
                    "Safari >= 11"
                  ]
                  : [
                    "Android >= 5",
                    "Chrome >= 30",
                    "Edge >= 12",
                    "Explorer >= 11",
                    "Firefox >= 27",
                    "iOS >= 5",
                    "Safari >= 7"
                  ]
              },
              "useBuiltIns": "usage"
            }
          ]
        ]
      }))
