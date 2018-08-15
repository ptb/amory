import path from "path"
import Config from "webpack-chain"

export default ({
  config = new Config (),
  context = path.resolve (process.cwd ()),
  define = {},
  mode = "production"
}) => config.toConfig ()
