import { createElement as h } from "react"
import Context from "./context.js"
import { Provider as StyletronProvider } from "styletron-react"
import { renderToString } from "react-dom/server"

exports.replaceRenderer = ({
  bodyComponent,
  setHeadComponents,
  replaceBodyHTMLString
}, options) => {
  const Styletron = Context (options)

  const body = h (Styletron.Consumer, {}, (styletron) =>
    h (StyletronProvider, { "value": styletron },
      bodyComponent
    )
  )

  replaceBodyHTMLString (renderToString (body))

  const head = h (Styletron.Consumer, {}, (styletron) => {
    const stylesheets = styletron.getStylesheets ()

    return stylesheets[0].css ?
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
  })

  setHeadComponents (head)
}
