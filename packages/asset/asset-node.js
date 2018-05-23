const { getFileNode, watcher } = require ("@amory/src-fs")
const { copy, ensureDir, unlink } = require ("fs-extra")
const { join } = require ("path").posix

module.exports = async (
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
  const opts = Object.assign (
    {
      "regex": /\.(.*)$/,
      "saveDir": ["/", "assets", "relDir"],
      "saveName": ["initName", "-", "initHash", ".", "saveExt"],
      "src": "src/assets",
      "type": "Asset"
    },
    options
  )

  const saveDir = async (node) => {
    const savePath = join (
      ... opts.saveDir.map ((part) => {
        switch (part) {
          case "initName":
            return node.name
          case "relDir":
            return node.relDir
          default:
            return part
        }
      })
    )

    await ensureDir (join (directory, "public", savePath))
    return savePath
  }

  const saveName = async (node) =>
    join (
      await saveDir (node),
      opts.saveName
        .map ((part) => {
          switch (part) {
            case "initHash":
              return node.internal.contentDigest.slice (0, 6)
            case "initName":
              return node.name
            case "saveExt":
              return node.ext
            default:
              return part
          }
        })
        .join ("")
    )

  const copyFile = async (node) => {
    const savePath = await saveName (node)

    await copy (node.absPath, join (directory, "public", savePath))
    return {
      "url": savePath
    }
  }

  const addAsset = async ({ src }) => {
    const node = await getFileNode ({
      createNodeId,
      opts,
      src,
      "type": opts.type
    })

    createNode (Object.assign (node, await copyFile (node)))
  }

  const delAsset = ({ src }) => {
    const node = getNode (createNodeId (src))

    if (node) {
      deleteNode ({ node })
      unlink (join (directory, "public", node.url))
    }
  }

  const fn = {
    "addFile": [addAsset, "SRC_FS_ASSET_ADD"],
    "delFile": [delAsset, "SRC_FS_ASSET_DEL"],
    "regex": opts.regex,
    "src": opts.src
  }

  await watcher (fn, emitter)
}
