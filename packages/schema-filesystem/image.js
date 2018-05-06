const getFileNode = require ("./node")
const sharp = require ("sharp")
const watcher = require ("./watch")

module.exports = async (
  { "actions": { createNode, deleteNode }, createNodeId, emitter, getNode },
  options = {}
) => {
  const opts = Object.assign ({
    "out": "public/img",
    "src": "src/images"
  }, options)

  const addFile = async ({ src }) => {
    const node = Object.assign ({},
      await getFileNode ({
        createNodeId,
        opts,
        src,
        "type": "Image"
      }),
      await sharp (src).metadata ())

    createNode (node)
  }

  const delFile = ({ src }) => {
    const node = getNode (createNodeId (src))

    if (node) {
      deleteNode (node.id, node)
    }
  }

  const modFile = async ({ src }) => {
    delFile (src)
    addFile (src)
  }

  const fn = {
    "addFile": [addFile, "GQL_FS_IMG_ADD"],
    "delFile": [delFile, "GQL_FS_IMG_DEL"],
    "modFile": [modFile, "GQL_FS_IMG_MOD"],
    "out": opts.out,
    "regex": /\.(gif|jpe?g|png|svg|tiff?|webp)$/i,
    "src": opts.src
  }

  await watcher (fn, emitter)
}
