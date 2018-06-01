const FaviconsWebpackPlugin = require ("favicons-webpack-plugin")

exports.onCreateWebpackConfig = (
  { actions, stage },
  { icons, logo, prefix }
) => {
  switch (stage) {
    case "build-html":
      actions.setWebpackConfig ({
        "plugins": [
          new FaviconsWebpackPlugin ({
            "icons": {
              "android": true,
              "appleIcon": true,
              "appleStartup": false,
              "coast": false,
              "favicons": true,
              "firefox": true,
              "twitter": true,
              "windows": true,
              "yandex": false,
              ... icons
            },
            "logo": logo || "./src/favicon.png",
            "prefix": prefix || "icons/"
          })
        ]
      })
      break
    default:
      break
  }
}
