/*! @copyright Peter T Bosse II | @license MIT | @link github.com/ptb/amory */
/* eslint-disable no-process-exit, no-shadow */

import chokidar from "@amory/chokidar"
import crypto from "crypto"
import { readFileSync } from "fs"
import { dirname } from "path"

const files = new Map ()

const getHash = (src) =>
  crypto
    .createHash ("sha1")
    .update (src)
    .update (readFileSync (src))
    .digest ("hex")

let digest

export default (() => {
  const agent = new chokidar.FSWatcher ({ "ignored": /\.git|node_modules/ })

  agent.on ("add", (src) => {
    digest = getHash (src)
    if (digest !== files.get (src)) {
      files.set (src, digest)
      process.send ({ digest, "evt": "addFile", src })
    }
  })

  agent.on ("change", (src) => {
    digest = getHash (src)
    if (digest !== files.get (src)) {
      files.set (src, digest)
      process.send ({ "evt": "modDir", "src": dirname (src) })
      process.send ({ digest, "evt": "modFile", src })
    }
  })

  agent.on ("unlink", (src) => {
    digest = files.get (src)
    files.delete (src)
    process.send ({ "evt": "modDir", "src": dirname (src) })
    process.send ({ digest, "evt": "delFile", src })
  })

  agent.on ("addDir", (src) => {
    process.send ({ "evt": "addDir", src })
  })

  agent.on ("unlinkDir", (src) => {
    process.send ({ "evt": "delDir", src })
  })

  agent.on ("ready", () => {
    process.send ({ "evt": "ready" })
  })

  process.on ("disconnect", () => {
    process.exit ()
  })

  process.on ("message", ({ cmd, opts }) => {
    try {
      agent[cmd] (opts)
    } catch (error) {
      throw new Error (error)
    }
  })

  process.send ({ "evt": "start" })
}) ()
