import { createElement as h } from "react"
import Context from "./context.js"
import { Provider as StyletronProvider } from "styletron-react"

let StyletronContext

exports.wrapRootComponent = ({ Root }, options) => () => {
  StyletronContext = Context (options).Consumer
  StyletronContext.displayName = "StyletronContext"

  return h (StyletronContext, {}, (styletron) =>
    h (StyletronProvider, { "value": styletron },
      h (Root)
    )
  )
}

module.exports.context = StyletronContext
