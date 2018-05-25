const { dirname, join, parse, relative, resolve } = require ("path").posix
const slash = require ("slash")
const { stat } = require ("fs-extra")
const { watcher } = require ("@amory/src-fs")

const canProcess = (pages, src) =>
  pages.reduce ((a, b) => a.concat (b.component), []).includes (src)

const getPage = (base, src, component) => {
  const { dir, name } = parse (relative (slash (base), slash (src)))

  return {
    "component": component || src,
    "path": join ("/", dir, name === "index" ? "" : name, "/")
  }
}

const reactPages = async (
  { "actions": { createPage, deletePage }, emitter, store },
  options = {}
) => {
  const { directory } = store.getState ().program
  const absPath = resolve (directory, options.path || "src/pages/index.jsx")
  const stats = await stat (absPath)

  const opts = Object.assign (options, {
    "component": options.component || stats.isFile () ? absPath : null,
    "src": stats.isDirectory () ? absPath : dirname (absPath)
  })

  const addPage = ({ src }) => {
    if (!canProcess (store.getState ().pages, src)) {
      createPage (getPage (opts.src, src, opts.component))
    }
  }

  const delPage = ({ src }) => {
    if (canProcess (store.getState ().pages, src)) {
      deletePage (getPage (opts.src, src, opts.component))
    }
  }

  const fn = {
    "addFile": [addPage, "SRC_FS_PAGE_ADD"],
    "delFile": [delPage, "SRC_FS_PAGE_DEL"],
    "regex": /(?!^(_|template-)|(\.d\.t|(spec|test)\.j)sx?$)\.jsx?$/,
    "src": opts.src
  }

  await watcher (fn, emitter)
}

module.exports = {
  reactPages
}
