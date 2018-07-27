const { ensureDirSync } = require ("fs-extra")
const { resolve } = require ("path").posix
const Config = require ("webpack-chain")

const dest = (context, mode) => {
  const dir = resolve (
    context,
    mode === "development" ? "dev" : "web"
  )

  ensureDirSync (dir)

  return dir
}

module.exports = ({
  config = new Config (),
  context = resolve (process.cwd ()),
  mode = "production"
}) =>
  config
    .context (context)
    .mode (mode)
    .output.path (dest (context, mode))
    .end ()
    .toConfig ()
