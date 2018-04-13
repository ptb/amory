const crypto = require ("crypto")
const fs = require ("fs-extra")
const mime = require ("mime")
const path = require ("path")
const md5File = require ("md5-file/promise")
const prettyBytes = require ("pretty-bytes")
const slash = require ("slash")

const createId = (src) => `${slash (src)} absPath of file`

const createFileNode = async (src, opts = {}) => {
  let node = {
    "absolutePath": slash (src),
    "children": [],
    "cwd": slash (opts.path || process.cwd ()),
    "id": createId (src),
    "parent": "___SOURCE___",
    "sourceInstanceName": opts.name || "__PROGRAMATTIC__"
  }

  const stats = await fs.stat (node.absolutePath)

  node = { ... node,
    ... path.parse (node.absolutePath),
    ... stats,
    "absPath": slash (path.resolve (node.absolutePath)),
    "relativePath": slash (path.relative (node.cwd, node.absolutePath)) }

  node = { ... node,
    "accessTime": node.atime,
    "birthTime": node.birthtime,
    "changeTime": node.ctime,
    "extension": node.ext.slice (1).toLowerCase (),
    "internal": stats.isDirectory ()
      ? {
        "contentDigest": crypto
          .createHash ("md5")
          .update (JSON.stringify ({
            "absolutePath": node.absolutePath,
            "stats": stats
          }))
          .digest ("hex"),
        "type": "Directory"
      }
      : {
        "contentDigest": await md5File (node.absolutePath),
        "mediaType": mime.getType (node.ext),
        "type": "File"
      },
    "modifiedTime": node.mtime,
    "prettySize": prettyBytes (node.size),
    "relativeDirectory": path.relative (node.cwd, node.dir) }

  node = { ... node,
    "allFiles": stats.isDirectory ()
      ? await fs
        .readdir (node.absolutePath)
        .map ((file) => path.join (node.absolutePath, file))
        .filter ((file) => fs.statSync (file).isFile ())
        .map ((file) => createFileNode (file, opts))
      : [] }

  return JSON.parse (JSON.stringify (node))
}

exports.createFileNode = createFileNode
exports.createId = createId
