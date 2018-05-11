const chokidar = require ("chokidar")
const { dirname } = require ("path").posix
const nodeDir = require ("node-dir")
const { stat } = require ("fs-extra")

module.exports = async (fn = {}, emitter) => {
  const a = await stat (fn.src)

  fn.src = a.isDirectory () ? fn.src : dirname (fn.src)
  fn.addFile &&
    await Promise.all (
      nodeDir
        .promiseFiles (fn.src)
        .then ((files) =>
          files
            .filter ((src) => fn.regex.test (src))
            .map ((src) => fn.addFile[0] ({ src })))
    )

  fn.addFile &&
    emitter.on (
      fn.addFile[1],
      ({ src }) => fn.regex.test (src) && fn.addFile[0] ({ src })
    )
  fn.modFile &&
    emitter.on (
      fn.modFile[1],
      ({ src }) => fn.regex.test (src) && fn.modFile[0] ({ src })
    )
  fn.delFile &&
    emitter.on (
      fn.delFile[1],
      ({ src }) => fn.regex.test (src) && fn.delFile[0] ({ src })
    )
  fn.addDir && emitter.on (fn.addDir[1], ({ src }) => fn.addDir[0] ({ src }))
  fn.modDir && emitter.on (fn.modDir[1], ({ src }) => fn.modDir[0] ({ src }))
  fn.delDir && emitter.on (fn.delDir[1], ({ src }) => fn.delDir[0] ({ src }))
  fn.ready && emitter.on (fn.ready[1], ({ src }) => fn.ready[0] ({ src }))

  await chokidar
    .watch (fn.src, fn.opts)
    .on ("add", (src) => {
      if (fn.regex.test (src)) {
        fn.addFile && emitter.emit (fn.addFile[1], { src })
        fn.modDir && emitter.emit (fn.modDir[1], { "src": dirname (src) })
      }
    })
    .on ("change", (src) => {
      if (fn.regex.test (src)) {
        fn.modFile && emitter.emit (fn.modFile[1], { src })
        fn.modDir && emitter.emit (fn.modDir[1], { "src": dirname (src) })
      }
    })
    .on ("unlink", (src) => {
      if (fn.regex.test (src)) {
        fn.delFile && emitter.emit (fn.delFile[1], { src })
        fn.modDir && emitter.emit (fn.modDir[1], { "src": dirname (src) })
      }
    })
    .on ("addDir", (src) => {
      fn.addDir && emitter.emit (fn.addDir[1], { src })
    })
    .on ("unlinkDir", (src) => {
      fn.delDir && emitter.emit (fn.delDir[1], { src })
    })
    .on ("ready", () => {
      fn.ready && emitter.emit (fn.ready[1], { "src": fn.src })
    })
}
