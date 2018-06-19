const merge = require ("deepmerge")
const HtmlWebpackPlugin = require ("html-webpack-plugin")
const HtmlWebpackTemplate = require ("html-webpack-template")

module.exports = (config) =>
  config.module
    .rule ("html")
    .test (/\.html$/)
    .exclude.add (/node_modules/)
    .end ()
    .use ("html")
    .loader (require.resolve ("html-loader"))
    .tap ((options = {}) =>
      merge (options, {
        "minimize": true
      }))
    .end ()
    .end ()
    .end ()
    .plugin ("html")
    .use (HtmlWebpackPlugin)
    .tap ((options = {}) => [
      merge (options, {
        "appMountId": "root",
        "inject": false,
        "minify": {
          "collapseWhitespace": true,
          "keepClosingSlash": true,
          "preserveLineBreaks": true,
          "useShortDoctype": true
        },
        "mobile": true,
        "template": HtmlWebpackTemplate,
        "xhtml": true
      })
    ])
