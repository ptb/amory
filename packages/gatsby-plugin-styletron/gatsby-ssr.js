const h = require ("react").createElement
const Provider = require ("styletron-react").Provider
const renderToString = require ("react-dom/server").renderToString
const styletron = require ("./index.js")

exports.replaceRenderer = (
  { bodyComponent, setHeadComponents, replaceBodyHTMLString },
  options
) => {
  const instance = styletron (options).instance

  const app = h (Provider, { "value": instance }, bodyComponent)

  replaceBodyHTMLString (renderToString (app))

  const stylesheets = instance.getStylesheets ()
  const headComponents = stylesheets[0].css
    ? stylesheets.map ((sheet, index) =>
      h ("style", {
        "className": "rehydrate",
        "dangerouslySetInnerHTML": {
          "__html": sheet.css
        },
        "key": index,
        "media": sheet.attrs.media
      }))
    : null

  setHeadComponents (headComponents)
}
