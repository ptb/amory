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

module.exports = ({
  config = new Config (),
  context = path.resolve (process.cwd ()),
  define = {},
  mode = "production"
}) =>
  /* eslint-disable indent */
  config
    .context (context)
    .entry ("index")
      .add (path.resolve (context, "src", "js", "index"))
      .end ()
    .mode (mode)
    .output
      .path (dest ({ context, mode }))
      .end ()
    .when (
      define.stage === "xhtml" || mode === "development",

      () =>
        config
          .output
            .filename (path.join ("js", "[name].js"))
            .end (),

      () =>
        config
          .output
            .filename (path.join ("js", "[name]-[contenthash:6].js"))
            .end ()
    )
