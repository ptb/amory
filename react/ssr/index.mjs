import { existsSync } from "fs"
import { join, relative } from "path"

import { h, renderToString } from "@amory/react"

import html from "./html.mjs"

export default async ({ app, request, response, state }, next) => {
  if (!(/\/$/).test (request.url)) {
    return next ()
  }

  let bodyEnd, filepath, root, source

  switch (true) {
    case existsSync (join (state.root, request.url, "index.mjs")):
      filepath = join (state.root, request.url, "index.mjs")
      source = await import (filepath)
      break
    case existsSync (join (state.root, "js", "index.mjs")):
      filepath = join (state.root, "js", "index.mjs")
      source = await import (filepath)
      break
    default:
      break
  }

  if (filepath && source) {
    bodyEnd = h ("script", {
      "dangerouslySetInnerHTML": {
        "__html": [
          `import{h,hydrate}from"/js/@amory/react.mjs"`,
          `import root from"/${relative (state.root, filepath)}"`,
          `hydrate(h(root),document.getElementById("root"))`
        ].join (";")
      },
      "type": "module"
    })

    root = await renderToString (
      h (source.default, { "env": app.env, "url": request.url })
    )

    response.body = await html ({ bodyEnd, root })
    response.type = "text/html"
  }
  return next ()
}
