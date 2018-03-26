import { createElement as h } from "react"
import Context from "./styletron-context.js"
import { Provider as StyletronProvider } from "styletron-react"
import { renderToString } from "react-dom/server"

exports.replaceRenderer = ({
  bodyComponent,
  setHeadComponents,
  replaceBodyHTMLString
}, options) => {
  const StyletronContext = Context (options).Consumer

  const body = h (StyletronContext, {}, (styletron) =>
    h (StyletronProvider, { "value": styletron },
      bodyComponent
    )
  )

  replaceBodyHTMLString (renderToString (body))

  const head = h (StyletronContext, {}, (styletron) => {
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
