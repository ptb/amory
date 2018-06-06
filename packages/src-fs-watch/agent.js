const { FSWatcher } = require ("@amory/chokidar")

let agent

class FSAgent {
  static sendEvent ({ evt, src }) {
    process.send ({ evt, src })
  }

  constructor (opts = {}) {
    this.watcher = new FSWatcher (opts)
      .on ("ready", () => FSAgent.sendEvent ({ "evt": "ready" }))
      .on ("all", (evt, src) => FSAgent.sendEvent ({ evt, src }))
  }

  execMethod (cmd, opts = []) {
    try {
      this.watcher[cmd] (... Array.isArray (opts) ? opts : [opts])
    } catch (err) {
      throw new Error (err)
    }
  }
}

process.on ("disconnect", () => {
  process.exit ()
})

process.on ("error", (err) => {
  throw new Error (err)
})

process.on ("message", ({ cmd, opts = {} }) => {
  switch (cmd) {
    case "init":
      agent = new FSAgent (opts)
      break
    case "exit":
      process.exit ()
      break
    default:
      agent.execMethod (cmd, opts)
  }
})
