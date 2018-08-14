import merge from "@amory/merge"
import nodeDir from "node-dir"
import ScriptExtHtmlWebpackPlugin from "script-ext-html-webpack-plugin"
import Config from "webpack-chain"

export default ({
  config = new Config (),
  define = {}
}) => {
  const dir = config.output.get ("path")

  /* eslint-disable indent */
  config.when (
    define.stage !== "xhtml",

    () => {
      config
        .module
          .rule ("module")
          .post ()
          .test (/src\/index\.mjs$/)
          .use ("module")
            .loader ("@amory/module")
            .end ()
          .end ()
        .end ()

      nodeDir
        .files (dir, { "sync": true })
        .filter ((asset) => (/\.(html?)$/).test (asset))
        .forEach ((asset) =>
          config
            .plugin (`${asset}ModuleAttr`)
            .use (ScriptExtHtmlWebpackPlugin)
            .tap ((options = {}) => [
              merge (options, {
                "module": [/\.mjs$/]
              })
            ])
            .after (asset)
            .end ())

      return config
    }
  )
}
