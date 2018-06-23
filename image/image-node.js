const { getFileNode, watcher } = require ("@amory/src-fs")
const sharp = require ("sharp")

module.exports = async (
  { "actions": { createNode, deleteNode }, createNodeId, emitter, getNode },
  options = {}
) => {
  const opts = Object.assign (
    {
      "src": "src/images"
    },
    options
  )

  const addImg = async ({ src }) => {
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

  const delImg = ({ src }) => {
    const node = getNode (createNodeId (src))

    if (node) {
      deleteNode (node.id, node)
    }
  }

  const fn = {
    "addFile": [addImg, "SRC_FS_IMG_ADD"],
    "delFile": [delImg, "SRC_FS_IMG_DEL"],
    "regex": /\.(gif|jpe?g|png|svg|tiff?|webp)$/i,
    "src": opts.src
  }

  await watcher (fn, emitter)
}
