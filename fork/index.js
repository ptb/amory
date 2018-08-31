const { fork } = require ("child_process")
const { createInterface } = require ("readline")

module.exports = (debug, script) => {
  const thread = fork (script, [], { "stdio": ["pipe", "pipe", "pipe", "ipc"] })

  const stdout = createInterface ({ "input": thread.stdout })
  const stderr = createInterface ({ "input": thread.stderr })

  process.on ("exit", () => thread.kill ("SIGINT"))

  thread.on ("exit", (code, signal) => {
    if (code !== 0) {
      debug (code, signal)
    }
  })

  thread.on ("message", (msg) => debug (msg))

  stdout.on ("line", (msg) => debug (msg))
  stderr.on ("line", (msg) => debug (msg))

  return thread
}
