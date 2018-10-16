import { h, renderToStaticMarkup } from "@amory/react"

export default ({
  bodyAttrs = {},
  bodyEnd = h ("script", { "src": "/js/index.mjs", "type": "module" }),
  bodyTop = null,
  headEnd = null,
  headTop = h ("title", {}, " "),
  htmlAttrs = {},
  root = ""
} = {}) =>
  `<!DOCTYPE html>${renderToStaticMarkup (
    h (
      "html",
      {
        "lang": "en",
        "xmlns": "http://www.w3.org/1999/xhtml",
        ... htmlAttrs
      },
      [
        h ("head", { "key": "head" }, [
          h ("meta", { "charset": "utf-8", "key": "charset" }),
          headTop,
          h ("meta", {
            "content": "initial-scale=1,width=device-width",
            "key": "viewport",
            "name": "viewport"
          }),
          headEnd
        ]),
        h ("body", { "key": "body", ... bodyAttrs }, [
          bodyTop,
          h ("div", {
            "dangerouslySetInnerHTML": { "__html": root },
            "id": "root",
            "key": "root"
          }),
          bodyEnd
        ])
      ]
    )
  )}`
