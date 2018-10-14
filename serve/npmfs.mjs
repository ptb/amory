/*! @copyright Peter T Bosse II | @license MIT | @link github.com/ptb/amory */
/* eslint-disable consistent-return */

import acorn from "acorn"
import dynamicImport from "acorn-dynamic-import"
import importMeta from "acorn-import-meta"
import { readFileSync } from "fs"
import { join } from "path"
import resolve from "resolve"

const parse = (source) =>
  acorn.Parser.extend (dynamicImport.default)
    .extend (importMeta)
    .parse (source, {
      "allowHashBang": true,
      "sourceType": "module"
    })

export default ({ request, response, state }, next) => {
  let pkg, source

  switch (true) {
    case (/\.m?js$/).test (request.url):
      source = readFileSync (join (state.root, request.url), "utf8")

      for (const node of parse (source).body) {
        if (
          node.type === "ImportDeclaration" &&
          !(/^(\.|\/)/).test (node.source.value)
        ) {
          source = source.replace (
            new RegExp (`( from ?")(${node.source.value}")`),
            "$1/@npm/$2"
          )
        }
      }
      break
    case (/^\/@npm\//).test (request.url):
      pkg = request.url.match (/^\/@npm\/(.+)/)[1]

      if (resolve.isCore (pkg)) {
        return next ()
      }

      console.log (resolve.sync (pkg))

      source = readFileSync (resolve.sync (pkg), "utf8")
      break
    default:
      return next ()
  }

  response.body = source
  response.type = "application/ecmascript"
}
