import fs from "fs-extra"
import { resolve } from "path"
import Config from "webpack-chain"

const dest = ({ context, mode }) => {
  const dir = resolve (
    context,
    mode === "development" ? "dev" : "web"
  )

  fs.ensureDirSync (dir)

  return dir
}

export default ({
  config = new Config (),
  context = resolve (process.cwd ()),
  mode = "production"
}) =>
  /* eslint-disable indent */
  config
    .context (context)
    .entry ("index")
      .add (resolve (context, "src", "index"))
      .end ()
    .mode (mode)
    .output
      .path (dest ({ context, mode }))
      .end ()
