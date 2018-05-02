const chokidar = require ("chokidar")
const { dirname } = require ("path").posix
const existsSync = require ("fs").existsSync

module.exports = (opts, emitter) =>
  (existsSync (opts.src)
    ? chokidar
      .watch (opts.src, opts)
      .on ("add", (src) => {
        emitter.emit ("WATCH_FS_ADD_FILE", { "src": src })
        emitter.emit ("WATCH_FS_MOD_DIR", { "src": dirname (src) })
      })
      .on ("change", (src) => {
        emitter.emit ("WATCH_FS_MOD_FILE", { "src": src })
        emitter.emit ("WATCH_FS_MOD_DIR", { "src": dirname (src) })
      })
      .on ("unlink", (src) => {
        emitter.emit ("WATCH_FS_DEL_FILE", { "src": src })
        emitter.emit ("WATCH_FS_MOD_DIR", { "src": dirname (src) })
      })
      .on ("addDir", (src) => {
        emitter.emit ("WATCH_FS_ADD_DIR", { "src": src })
      })
      .on ("unlinkDir", (src) => {
        emitter.emit ("WATCH_FS_DEL_DIR", { "src": src })
      })
      .on ("ready", () => {
        emitter.emit ("WATCH_FS_READY", { "src": opts.src })
        done ()
      })
    : null)
