/*! @copyright Peter T Bosse II | @license MIT | @link github.com/ptb/amory */
/* eslint-disable consistent-return */

import acorn from "acorn"
import dynamicImport from "acorn-dynamic-import"
import importMeta from "acorn-import-meta"
import { existsSync, readFileSync } from "fs"
import { join, resolve as _resolve } from "path"
import resolve from "resolve"

const parse = (source) =>
  acorn.Parser.extend (dynamicImport.default)
    .extend (importMeta)
    .parse (source, {
      "allowHashBang": true,
      "sourceType": "module"
    })

export default ({ request, response, state }, next) => {
  if (!(/\.m?js$/).test (request.url)) {
    return next ()
  }

  let file = join (state.root, request.url)
  let pkg, source

  if (existsSync (file)) {
    source = readFileSync (file, "utf8")

    for (const node of parse (source).body) {
      if (
        node.type === "ImportDeclaration" &&
          !(/^(\.|\/)/).test (node.source.value)
      ) {
        source = source.replace (
          new RegExp (`( from ?")(${node.source.value})"`),
          "$1/js/$2.mjs\""
        )
      }
    }
  } else {
    pkg = request.url.match (/^\/js\/(.+)\.mjs/)[1]

    if (resolve.isCore (pkg)) {
      return next ()
    }

    file = resolve.sync (pkg, { "basedir": _resolve (state.root, "..") })
    source = readFileSync (file, "utf8")
  }

  response.body = source
  response.type = "application/ecmascript"
  return next ()
}
