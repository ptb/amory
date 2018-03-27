import { createElement as h } from "react"
import styletron from "./instance.js"
import { Provider as StyletronProvider } from "styletron-react"
import { renderToString } from "react-dom/server"

exports.replaceRenderer = ({
  bodyComponent,
  setHeadComponents,
  replaceBodyHTMLString
}, options) => {
  const body = h (StyletronProvider, { "value": styletron }, bodyComponent)

  replaceBodyHTMLString (renderToString (body))

  const stylesheets = styletron.getStylesheets ()
  const head = stylesheets[0].css ?
    stylesheets.map ((sheet, index) =>
      h ("style", {
        "className": "_styletron_hydrate_",
        "dangerouslySetInnerHTML": {
          "__html": sheet.css
        },
        "key": index,
        "media": sheet.attrs.media
      })
    )
    : null

  setHeadComponents (head)
}
