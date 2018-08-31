const debug = require ("debug") ("@amory:webpack")
const webpack = require ("webpack")

const exit = process.exit

let compiler

process.on ("disconnect", () => exit ())

process.on ("error", (error) => {
  throw new Error (error)
})

process.on ("message", ({ cmd, config }) => {
  switch (cmd) {
    case "build":
      compiler = webpack (config)

      compiler.run ((err, stats) => {
        const errors = stats.hasErrors ()
          ? stats.toJson ().errors
          : err

        if (errors) {
          debug (errors)
          throw new Error (errors)
        } else {
          exit ()
        }
      })
      break
    default:
      break
  }
})
