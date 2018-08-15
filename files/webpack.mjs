import fs from "fs-extra"
import path from "path"
import Config from "webpack-chain"

const dest = ({ context, mode }) => {
  const dir = path.resolve (
    context,
    mode === "development" ? "dev" : "web"
  )

  fs.ensureDirSync (dir)

  return dir
}

export default ({
  config = new Config (),
  context = path.resolve (process.cwd ()),
  define = {},
  mode = "production"
}) =>
  /* eslint-disable indent */
  config
    .context (context)
    .entry ("index")
      .add (path.resolve (context, "src", "index"))
      .end ()
    .mode (mode)
    .optimization
      .splitChunks ({
        "cacheGroups": {
          "react": {
            "chunks": "all",
            "name": "react",
            "test": /react/
          }
        }
      })
      .end ()
    .output
      .path (dest ({ context, mode }))
      .end ()
    .when (
      define.stage === "xhtml" || mode === "development",

      () =>
        config
          .output
            .filename ("[name].js")
            .end (),

      () =>
        config
          .output
            .filename (path.join ("js", "[name]-[contenthash:6].js"))
            .end ()
    )
