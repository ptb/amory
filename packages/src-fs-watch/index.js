const { fork } = require ("child_process")
const crypto = require ("crypto")
const { existsSync, readFileSync } = require ("fs-extra")
const { dirname, join } = require ("path").posix
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
    "cwd": process.cwd (),
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
        digest = getHash (src)
        if (digest !== files.get (src)) {
          files.set (src, digest)
          queue.next ({ digest, "evt": "addFile", src })
        }
        break

      case "change":
        digest = getHash (src)
        if (digest !== files.get (src)) {
          files.set (src, digest)
          queue.next ({ "evt": "modDir", "src": dirname (src) })
          queue.next ({ digest, "evt": "modFile", src })
        }
        break

      case "unlink":
        digest = files.get (src)
        files.delete (src)
        queue.next ({ "evt": "modDir", "src": dirname (src) })
        queue.next ({ digest, "evt": "delFile", src })
        break

      case "addDir":
        queue.next ({ "evt": "addDir", src })
        break

      case "unlinkDir":
        queue.next ({ "evt": "delDir", src })
        break

      default:
        queue.next ({ evt, src })
        break
    }
  })

  agent.send ({ "cmd": "init", "opts": opts })

  if (existsSync (opts.src)) {
    agent.send ({ "cmd": "add", "opts": opts.src })
  }

  return queue
}) ()
