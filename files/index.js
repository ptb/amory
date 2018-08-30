const fs = require ("fs-extra")
const path = require ("path")
const Config = require ("webpack-chain")

const dest = ({ context, mode }) => {
  const dir = path.resolve (
    context,
    mode === "development" ? "dev" : "web"
  )

  fs.ensureDirSync (dir)

  return dir
}

const addWebpackConfig = ({
  context = path.resolve (process.cwd ()),
  define = {},
  mode = "production",
  webpack = new Config ()
}) =>
  /* eslint-disable indent */
  webpack
    .context (context)
    .entry ("index")
      .add (path.resolve (context, "src", "js", "index"))
      .end ()
    .mode (mode)
    .output
      .path (dest ({ context, mode }))
      .end ()
    .when (
      define.stage === "markup" || mode === "development",

      () =>
        webpack
          .output
            .filename (path.join ("js", "[name].js"))
            .end (),

      () =>
        webpack
          .output
            .filename (path.join ("js", "[name]-[contenthash:6].js"))
            .end ()
    )

module.exports = {
  "name": "@amory/files",
  "setConfig": addWebpackConfig
}
