const axios = require ("axios")
const { createWriteStream, exists, pathExists } = require ("fs-extra")
const { queueImageResizing } = require ("gatsby-plugin-sharp")
const {
  DuotoneGradientType,
  "ImageCropFocusType": SharpImageCropFocusType
} = require ("../../gatsby-transformer-sharp/types")

const {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString
} = require ("graphql")

const generateSqip = require ("./generate-sqip")
const { extname, pathResolve } = require ("path").posix
const {
  "schemes": {
    "ImageCropFocusType": ContentfulImageCropFocusType,
    ImageResizingBehavior
  }
} = require ("gatsby-source-contentful")
const sharp = require ("sharp")

const CACHE_DIR = pathResolve (process.cwd (), "public", "static")

const arg = {
  "common": {
    "blur": {
      "defaultValue": 1,
      "type": GraphQLInt
    },
    "height": {
      "type": GraphQLInt
    },
    "mode": {
      "defaultValue": 0,
      "type": GraphQLInt
    },
    "numberOfPrimitives": {
      "defaultValue": 10,
      "type": GraphQLInt
    },
    "width": {
      "defaultValue": 256,
      "type": GraphQLInt
    }
  },
  "contentful": {
    "background": {
      "defaultValue": null,
      "type": GraphQLString
    },
    "cropFocus": {
      "defaultValue": null,
      "type": ContentfulImageCropFocusType
    },
    "resizingBehavior": {
      "type": ImageResizingBehavior
    }
  },
  "sharp": {
    "cropFocus": {
      "defaultValue": sharp.strategy.attention,
      "type": SharpImageCropFocusType
    },
    "duotone": {
      "defaultValue": false,
      "type": DuotoneGradientType
    },
    "grayscale": {
      "defaultValue": false,
      "type": GraphQLBoolean
    },
    "rotate": {
      "defaultValue": 0,
      "type": GraphQLInt
    }
  }
}

exports.setFieldsOnGraphQLNodeType = ({
  cache,
  getNodeAndSavePathDependency,
  "type": { "name": type }
}) => {
  switch (type) {
    case "ContentfulAsset":
      return {
        "sqip": {
          "args": { ... arg.common, ... arg.contentful },
          "resolve": async (asset, b) => {
            const {
              "file": {
                contentType,
                "details": { image },
                fileName,
                url
              },
              id
            } = asset

            if (/^image\//.test (contentType)) {
              return null
            }

            const r = (b.height || image.height) / (b.width || image.width)
            const previewWidth = 256
            const previewHeight = Math.floor (previewWidth * r)

            const params = [`w=${previewWidth}`, `h=${previewHeight}`]

            if (b.resizingBehavior) {
              params.push (`fit=${b.resizingBehavior}`)
            }
            if (b.cropFocus) {
              params.push (`crop=${b.cropFocus}`)
            }
            if (b.background) {
              params.push (`bg=${b.background}`)
            }

            const uniqueId = [
              id,
              r,
              b.resizingBehavior,
              b.cropFocus,
              b.background
            ]
              .filter (Boolean)
              .join ("-")

            const ext = extname (fileName)
            const absolutePath = pathResolve (CACHE_DIR, `${uniqueId}${ext}`)
            const alreadyExists = await pathExists (absolutePath)

            if (!alreadyExists) {
              const response = await axios ({
                "method": "get",
                "responseType": "stream",
                "url": `http:${url}?${params.join ("&")}`
              })

              await new Promise ((resolve, reject) => {
                const file = createWriteStream (absolutePath)

                response.data.pipe (file)
                file.on ("finish", resolve)
                file.on ("error", reject)
              })
            }

            return generateSqip ({
              "absolutePath": absolutePath,
              "blur": b.blur,
              "cache": cache,
              "cacheDir": CACHE_DIR,
              "mode": b.mode,
              "numberOfPrimitives": b.numberOfPrimitives
            })
          }
        }
      }
    case "ImageSharp":
      return {
        "sqip": {
          "args": { ... arg.common, ... arg.sharp },
          "resolve": async (a, b, c) => {
            const args = {
              "cropFocus": b.cropFocus,
              "duotone": b.duotone,
              "grayscale": b.grayscale,
              "height": b.height,
              "rotate": b.rotate,
              "width": b.width
            }
            const file = getNodeAndSavePathDependency (a.parent, c.path)
            const job = await queueImageResizing ({ args, file })

            if (!await exists (job.absolutePath)) {
              await job.finishedPromise
            }

            return generateSqip ({
              "absolutePath": job.absolutePath,
              "blur": b.blur,
              "cache": cache,
              "cacheDir": CACHE_DIR,
              "mode": b.mode,
              "numberOfPrimitives": b.numberOfPrimitives
            })
          },
          "type": new GraphQLObjectType ({
            "fields": {
              "dataURI": {
                "type": GraphQLString
              },
              "svg": {
                "type": GraphQLString
              }
            },
            "name": "Sqip"
          })
        }
      }
    default:
      return {}
  }
}
