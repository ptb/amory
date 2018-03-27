import { createElement as h } from "react"
import styletron from "./instance.js"
import { Provider as StyletronProvider } from "styletron-react"

exports.wrapRootComponent = ({ Root }, _options) => () =>
  h (StyletronProvider, { "value": styletron }, h (Root))
