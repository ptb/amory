import { createElement as h } from "react"
import Context from "./context.js"
import { Provider as StyletronProvider } from "styletron-react"

exports.wrapRootComponent = ({ Root }, options) => () => {
  const Styletron = Context (options)
  Styletron.displayName = "StyletronContext"

  return h (Styletron.Consumer, {}, (styletron) =>
    h (StyletronProvider, { "value": styletron },
      h (Root)
    )
  )
}
