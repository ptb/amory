const { copy } = require ("fs-extra")
const { resolve } = require ("path").posix

exports.onPreExtractQueries = async ({ store }) => {
  const { directory } = store.getState ().program

  await copy (
    resolve (__dirname, "fragments.js"),
    resolve (directory, ".cache", "fragments", "amory-image.js")
  )
}

exports.setFieldsOnGraphQLNodeType = require ("./image-schema")
exports.sourceNodes = require ("./image-node")
