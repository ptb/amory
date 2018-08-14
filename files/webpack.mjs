import fs from "fs-extra"
import nodePath from "path"
import Config from "webpack-chain"

const dest = ({ context, mode }) => {
  const dir = nodePath.resolve (
    context,
    mode === "development" ? "dev" : "web"
  )

  fs.ensureDirSync (dir)

  return dir
}

export default ({
  config = new Config (),
  context = nodePath.resolve (process.cwd ()),
  define = {},
  mode = "production"
}) =>
  /* eslint-disable indent */
  config
    .context (context)
    .entry ("index")
      .add (nodePath.resolve (context, "src", "index"))
      .end ()
    .mode (mode)
    .output
      .path (dest ({ context, mode }))
      .end ()
    .when (
      define.stage === "xhtml" || mode === "development",

      (conf) =>
        conf
          .output
            .filename ("[name].js")
            .end (),

      (conf) =>
        conf
          .output
            .filename (nodePath.join ("js", "[name]-[hash:6].js"))
            .end ()
    )
