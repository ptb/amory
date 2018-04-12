const { GraphQLString } = require ("graphql")
const fs = require ("fs-extra")
const path = require ("path")

module.exports = ({ getNodeAndSavePathDependency, pathPrefix = "", type }) =>
  (type.name === "File"
    ? {
      "publicURL": {
        "args": {},
        "description":
          "Copy file to static directory and return public URL to it",
        "resolve": (file, _fieldArgs, context) => {
          const details = getNodeAndSavePathDependency (file.id, context.path)
          const digest = file.internal.contentDigest.slice (0, 6)
          const name = `${file.name}-${digest}${details.ext}`
          const pubPath = path.join (process.cwd (), "public", "static", name)

          if (!fs.existsSync (pubPath)) {
            fs.copy (details.absolutePath, pubPath, (err) => {
              if (err) {
                console.error (
                  `error copying "${details.absolutePath}" to "${pubPath}"`,
                  err
                )
              }
            })
          }

          return `${pathPrefix}/static/${name}`
        },
        "type": GraphQLString
      }
    }
    : {})
