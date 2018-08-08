/* eslint-disable no-unused-vars */

import { resolve } from "path"
import Config from "webpack-chain"

export default ({
  config = new Config (),
  context = resolve (process.cwd ()),
  define = {},
  mode = "production"
}) => config.toConfig ()
