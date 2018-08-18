const React = require ("react")
const ReactDOMServer = require ("react-dom/server")

const h = React.createElement
const renderToStaticMarkup = ReactDOMServer.renderToStaticMarkup

module.exports = ({
  body,
  bodyAttributes,
  headComponents,
  htmlAttributes,
  postBodyComponents,
  preBodyComponents
}) =>
  `<!DOCTYPE html>${renderToStaticMarkup (
    h ("html", {
      "lang": "en",
      "xmlns": "http://www.w3.org/1999/xhtml",
      ... htmlAttributes
    },
    [
      h ("head", { "key": "head" }, [
        h ("meta", { "charset": "utf-8", "key": "charset" }),
        h ("meta", {
          "content": "initial-scale=1,width=device-width",
          "key": "viewport",
          "name": "viewport"
        }),
        headComponents
      ]),
      h ("body", { "key": "body", ... bodyAttributes }, [
        preBodyComponents,
        h ("div", {
          "dangerouslySetInnerHTML": { "__html": body },
          "id": "root",
          "key": "root"
        }),
        postBodyComponents
      ])
    ])
  )}`
