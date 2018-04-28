const { canProcess, getPage } = require ("./index")
const { dirname, resolve } = require ("path").posix
const statSync = require ("fs").statSync
const watcher = require ("@ptb/watch-filesystem")

exports.createPagesStatefully = async (
  { actions, emitter, reporter, store },
  options,
  done
) => {
  const { createPage, deletePage } = actions
  const { directory, extensions } = store.getState ().program
  const absPath = resolve (directory, options.path || "src/pages")
  const stats = await statSync (absPath)

  const opts = {
    ... options,
    "component": options.component || stats.isFile () ? absPath : null,
    "exts": options.exts || extensions,
    "src": stats.isDirectory () ? absPath : dirname (absPath)
  }

  emitter.on ("WATCH_FS_ADD_FILE", ({ src }) => {
    const [a, b] = canProcess (opts.exts, src, store.getState ().pages)

    if (a && b) {
      createPage (getPage (opts.src, src, opts.component))
      reporter.info (`create page "${src}"`)
    }
  })

  emitter.on ("WATCH_FS_DEL_FILE", ({ src }) => {
    const [a, b] = canProcess (opts.exts, src, store.getState ().pages)

    if (a && !b) {
      deletePage (getPage (opts.src, src, opts.component))
      reporter.info (`delete page "${src}"`)
    }
  })

  await watcher (opts, emitter, reporter, done)
}
