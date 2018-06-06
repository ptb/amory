const { fork } = require ("child_process")
const crypto = require ("crypto")
const { existsSync, readFileSync } = require ("fs-extra")
const { join } = require ("path").posix
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
    agent = fork (join (__dirname, "agent"))
  }

  if (!files) {
    files = new Map ()
  }

  if (!queue) {
    queue = new ReplaySubject ()
  }

  agent.on ("message", ({ evt, src }) => {
    let digest

    switch (evt) {
      case "add":
      case "change":
        digest = getHash (src)

        if (digest !== files.get (src)) {
          files.set (src, digest)
          queue.next ({ digest, "evt": "change", src })
        }

        break
      case "unlink":
        digest = files.get (src)

        files.delete (src)
        queue.next ({ digest, "evt": "delete", src })
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
