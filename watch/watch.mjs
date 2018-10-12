/*! @copyright Peter T Bosse II | @license MIT | @link github.com/ptb/amory */
/* eslint-disable no-magic-numbers */

import { fork } from "child_process"
import { createInterface } from "readline"

export const pubSub = ((a) =>
  ({
    "pub": (b) => a.map ((c) => c (b)),
    "sub": (b) => {
      const c = a.push (b) - 1

      return () => delete a[c]
    }
  })) ([])

export default (debug, script) => {
  const thread = fork (script, [], {
    "execArgv": ["--experimental-modules", "--inspect=9229", "--no-warnings"],
    "stdio": ["pipe", "pipe", "pipe", "ipc"]
  })

  const stdout = createInterface ({ "input": thread.stdout })
  const stderr = createInterface ({ "input": thread.stderr })

  process.on ("exit", () => thread.kill ("SIGINT"))

  thread.on ("exit", (code, signal) => {
    if (code !== 0) {
      debug (code, signal)
    }
  })

  thread.on ("message", (msg) => {
    debug (msg)
    pubSub.pub (msg)
  })

  stdout.on ("line", (msg) => debug (msg))
  stderr.on ("line", (msg) => debug (msg))

  return thread
}
