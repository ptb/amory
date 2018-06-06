const { fork } = require ("child_process")
const crypto = require ("crypto")
const { existsSync, readFileSync } = require ("fs-extra")
const { ReplaySubject } = require ("rxjs")

const getHash = (src) =>
  crypto
    .createHash ("sha1")
    .update (src)
    .update (readFileSync (src))
    .digest ("hex")

let agent, files, queue

module.exports = (() => (options = {}) => {
  const opts = Object.assign ({
    "ignored": [
      "**/.cache",
      "**/.git",
      "**/node_modules"
    ],
    "src": process.cwd ()
  }, options)

  if (!agent) {
    agent = fork ("./agent")
  }

  if (!files) {
    files = new Map ()
  }

  if (!queue) {
    queue = new ReplaySubject ()
  }

  agent.on ("message", ({ evt, src }) => {
    let hash

    switch (evt) {
      case "add":
      case "change":
        hash = getHash (src)

        if (hash !== files.get (src)) {
          files.set (src, hash)
          queue.next ({ "evt": "change", hash, src })
        }

        break
      case "unlink":
        hash = files.get (src)

        files.delete (src)
        queue.next ({ "evt": "delete", hash, src })
        break
      default:
        break
    }
  })

  agent.send ({ "cmd": "init", "opts": opts })

  if (existsSync (opts.src)) {
    agent.send ({ "cmd": "add", "opts": opts.src })
  }

  return queue
}) ()
