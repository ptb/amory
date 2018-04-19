const chokidar = require ("chokidar")
const dir = require ("path").dirname
const Queue = require ("better-queue")

module.exports = (() => {
  let queue
  let ready = false

  const q = () => {
    queue =
      queue ||
      new Queue (
        (result, done) => {
          done (result)
        },
        {
          "precondition": (done) => {
            done (null, ready)
          }
        }
      )
    return queue
  }

  const watch = (opts, fn) => {
    opts.ignored = Array.prototype
      .concat (opts.ignored, "**/node_modules")
      .filter (Boolean)

    return chokidar
      .watch (opts.src, opts)

      .on ("add", (src) =>
        q ().push ({ "evt": "add", "obj": "file", src }, fn))
      .on ("change", (src) =>
        q ().push ({ "evt": "mod", "obj": "file", src }, fn))
      .on ("unlink", (src) =>
        q ().push ({ "evt": "del", "obj": "file", src }, fn))

      .on ("addDir", (src) =>
        q ().push ({ "evt": "add", "obj": "dir", src }, fn))
      .on ("add", (src) =>
        q ().push ({ "evt": "mod", "obj": "dir", "src": dir (src) }, fn))
      .on ("unlink", (src) =>
        q ().push ({ "evt": "mod", "obj": "dir", "src": dir (src) }, fn))
      .on ("unlinkDir", (src) =>
        q ().push ({ "evt": "del", "obj": "dir", src }, fn))

      .on ("ready", () => {
        ready = true
      })
  }

  return {
    "queue": q (),
    "watch": watch
  }
}) ()
