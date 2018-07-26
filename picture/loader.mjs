/* eslint max-statements: off, no-invalid-this: off, require-jsdoc: off */

import { existsSync, readFileSync } from "fs-extra"
import { getOptions, parseQuery } from "loader-utils"
import pMap from "p-map"
import { join } from "path"
import validate from "@webpack-contrib/schema-utils"

import defaults from "./defaults.json"
import merge from "./merge.mjs"
import resize from "./resize.mjs"
import schema from "./schema.json"

const image = ([buffer, opts, size, type]) => (dppx) =>
  resize[type] ([buffer, opts, size, type, dppx])

const create = ([buffer, opts]) => (size) => async (type) => {
  if (opts.setup[type].output) {
    switch (type) {
      case "color":
        return {
          "srcset": await pMap (
            [size.dppx[0]],
            image ([buffer, opts, size, type])
          ),
          "type": "image/png"
        }
      case "jpeg":
        return {
          "srcset": await pMap (size.dppx, image ([buffer, opts, size, type])),
          "type": "image/jpeg"
        }
      case "lqip":
        return {
          "srcset": await pMap (
            [size.dppx[0]],
            image ([buffer, opts, size, type])
          ),
          "type": "image/jpeg"
        }
      case "png":
        return {
          "srcset": await pMap (size.dppx, image ([buffer, opts, size, type])),
          "type": "image/png"
        }
      case "sqip":
        return {
          "srcset": await pMap (
            [size.dppx[0]],
            image ([buffer, opts, size, type])
          ),
          "type": "image/svg+xml"
        }
      case "webp":
        return {
          "srcset": await pMap (size.dppx, image ([buffer, opts, size, type])),
          "type": "image/webp"
        }
      default:
        break
    }
  }
}

const start = ([buffer, opts]) => async (size) =>
  merge (size, {
    "image": await pMap (
      ["webp", "png", "jpeg"],
      create ([buffer, opts]) (size)
    ).then ((images) => images.filter (Boolean)),
    "proxy": await pMap (
      ["sqip", "lqip", "color"],
      create ([buffer, opts]) (size)
    ).then ((proxies) => proxies.filter (Boolean))
  })

const loader = async function (source, map, meta) {
  const done = this.async ()

  let opts = [
    defaults,
    getOptions (this) || {},
    parseQuery (this.resourceQuery || "?")
  ].reduce ((values, target) => {
    // this.emitWarning ?
    validate ({
      "name": "@amory/picture",
      "schema": schema,
      "target": target
    })

    return merge (values, target)
  }, {})

  opts = merge (opts, await resize.getMetadata ([source, opts]) (this))
  const filepath = join (opts.input.relative, opts.input.name)
  const filename = join (
    filepath,
    `${opts.input.name}-${opts.input.hash}.json`
  )
  const fullname = join (this._compiler.outputPah, filename)

  let output

  if (existsSync (fullname)) {
    output = readFileSync (fullname)
  } else {
    opts.sizes = await resize.getSizes ([source, opts]) (opts.sizes)

    opts.emitFile = this.emitFile
    opts.sizes = await pMap (opts.sizes, start ([source, opts]))

    output = JSON.stringify (opts)

    this.emitFile (filename, output)
  }

  done (null, `export default ${output}`, map, meta)
}

const raw = true

export { loader as default, raw }
