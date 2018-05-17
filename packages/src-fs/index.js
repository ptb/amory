const chokidar = require ("chokidar")
const crypto = require ("crypto")
const { readFile, stat } = require ("fs-extra")
const gzipSize = require ("gzip-size")
const mime = require ("mime")
const nodeDir = require ("node-dir")
const { dirname, parse, relative, resolve } = require ("path").posix
const prettyBytes = require ("pretty-bytes")
const slash = require ("slash")

const getFileNode = async ({
  createNodeId,
  opts = {},
  src,
  type = "File"
}) => {
  const a = await stat (opts.src)
  const b = await stat (src)
  const c = parse (src)

  return {
    "absDir": slash (dirname (resolve (src))),
    "absPath": slash (resolve (src)),
    "bytes": b.size,
    "children": [],
    "createTime": b.birthtime,
    "ext": c.ext.slice (1),
    "filename": c.base,
    "gzipSize": prettyBytes (await gzipSize.file (src)),
    "id": createNodeId (src),
    "internal": {
      "contentDigest": crypto
        .createHash ("sha1")
        .update (createNodeId (src))
        .update (await readFile (src))
        .digest ("hex"),
      "mediaType": mime.getType (c.ext) || "application/octet-stream",
      "type": type
    },
    "modifyTime": b.mtime,
    "name": c.name,
    "parent": null,
    "relDir": slash (dirname (relative (opts.src, src))),
    "relPath": slash (relative (opts.src, src)),
    "size": prettyBytes (b.size),
    "src": src,
    "srcDir": slash (a.isDirectory () ? opts.src : dirname (opts.src)),
    "srcName": opts.name,
    "srcPath": slash (opts.src),

    "absolutePath": slash (resolve (src)),
    "extension": c.ext.slice (1)
  }
}

const watcher = async (fn = {}, emitter) => {
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

const sourceNodes = async (
  {
    "actions": { createNode, deleteNode },
    createNodeId,
    emitter,
    getNode,
    store
  },
  options = {}
) => {
  const { directory } = store.getState ().program

  const opts = Object.assign (options, {
    "regex": new RegExp (options.regex),
    "src": resolve (directory, options.src)
  })

  const addFile = async ({ src }) => {
    const node = await getFileNode ({
      createNodeId,
      options,
      src,
      "type": "File"
    })

    createNode (node)
  }

  const delFile = ({ src }) => {
    const node = getNode (createNodeId (src))

    if (node) {
      deleteNode (node.id, node)
    }
  }

  const fn = {
    "addFile": [addFile, "SRC_FS_FILE_ADD"],
    "delFile": [delFile, "SRC_FS_FILE_DEL"],
    "regex": opts.regex,
    "src": resolve (directory, opts.src)
  }

  await watcher (fn, emitter)
}

module.exports = {
  getFileNode,
  sourceNodes,
  watcher
}
