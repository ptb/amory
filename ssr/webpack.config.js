const ssr = require ("@amory/ssr")
const Config = require ("webpack-chain")

module.exports = ({ context = process.cwd (), mode = "production" }) => {
  const config = new Config ()

  config
    .context (context)
    .mode (mode)

  ssr (config)

  return config.toConfig ()
}
