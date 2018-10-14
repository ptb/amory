/*! @copyright Peter T Bosse II | @license MIT | @link github.com/ptb/amory */
/* eslint-disable no-magic-numbers */

import { fork } from "child_process"
import { dirname, resolve } from "path"

export const pubSub = ((a) =>
  ({
    "pub": (b) => a.map ((c) => c (b)),
    "sub": (b) => {
      const c = a.push (b) - 1

      return () => delete a[c]
    }
  })) ([])

export default (directory) => {
  const agent = resolve (dirname (import.meta.url.slice (7)), "agent.mjs")
  const thread = fork (agent, [], {
    "execArgv": ["--experimental-modules", "--no-warnings"]
  })

  process.on ("exit", () => thread.kill ("SIGINT"))

  thread.on ("message", (msg) => {
    if (msg.evt === "start") {
      thread.send ({ "cmd": "add", "opts": directory })
    }

    pubSub.pub (msg)
  })

  return thread
}
