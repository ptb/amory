const { dirname, parse, relative, resolve } = require ("path").posix
const { readFile, stat } = require ("fs-extra")
const crypto = require ("crypto")
const mime = require ("mime")
const gzipSize = require ("gzip-size")
const prettyBytes = require ("pretty-bytes")
const slash = require ("slash")

module.exports = async ({ createNodeId, opts = {}, src, type = "File" }) => {
  const a = await stat (opts.src)
  const b = await stat (src)
  const c = parse (src)

  return {
    "absDir": slash (dirname (resolve (src))),
    "absPath": slash (resolve (src)),
    "accessTime": b.atime,
    "bytes": b.size,
    "children": [],
    "createTime": b.birthtime,
    "ext": c.ext.slice (1),
    "filename": c.base,
    "gzipSize": prettyBytes (await gzipSize.file (src)),
    "id": createNodeId (src),
    "internal": {
      "contentDigest": crypto
        .createHash ("sha")
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
    "srcDir": slash (a.isDirectory () ? opts.src : dirname (opts.src)),
    "srcName": opts.name,
    "srcPath": slash (opts.src)
  }
}
