const debug = require ("debug") ("@amory:webpack")
const webpack = require ("webpack")
const Config = require ("webpack-chain")

let compiler

const runWebpack = ({
  "webpack": config = new Config ()
}) => {
  compiler = webpack (config.toConfig ())

  compiler.run ((err, stats) => {
    const errors = stats.hasErrors ()
      ? stats.toJson ().errors
      : err

    if (errors) {
      debug (errors)
      throw new Error (errors)
    }
  })
}

module.exports = {
  "name": "@amory/webpack",
  "runProcess": runWebpack
}
