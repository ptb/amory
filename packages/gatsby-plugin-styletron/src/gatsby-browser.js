import { createElement as h } from "react"
import Context from "./context.js"
import { Provider as StyletronProvider } from "styletron-react"

exports.wrapRootComponent = ({ Root }, options) => () => {
  const StyletronContext = Context (options).Consumer
  StyletronContext.displayName = "StyletronContext"

  return h (StyletronContext, {}, (styletron) =>
    h (StyletronProvider, { "value": styletron },
      h (Root)
    )
  )
}
