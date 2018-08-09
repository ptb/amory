/*! Inspired by Erik Desjardins (https://git.io/fNQsE) | MIT License */
/*! Modified by Peter T Bosse II <ptb@ioutime.com> (http://ptb2.me/) */

/* eslint-disable compat/compat, no-magic-numbers, require-jsdoc */

import merge from "@amory/merge"
import importFresh from "import-fresh"
import loaderUtils from "loader-utils"

import defaults from "./rollup.config.js"

const rollup = () => importFresh ("rollup")

export default function (content, sourcemap, meta) {
  /* eslint-disable-next-line consistent-this, no-invalid-this */
  const loader = this
  const done = loader.async ()

  rollup ()
    .rollup (
      merge (loader.query || {}, { "input": loader.resourcePath }, defaults)
    )
    .then ((bundle) =>
      bundle.generate ({ "format": "esm", "sourcemap": loader.sourceMap }))
    .then ((result) => {
      const filename = loaderUtils
        .interpolateName (loader, loader._compiler.options.output.filename, {
          "content": result.code,
          "context": loader._compiler.context
        })
        .replace (/\.js/, ".mjs")

      loader.emitFile (filename, result.code, result.map)
      done (null, content, sourcemap, meta)
    }, done)
}
