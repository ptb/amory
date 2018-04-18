import { createElement as h } from "react"
import { Provider } from "styletron-react"
import styletron from "./index.js"

exports.wrapRootComponent = ({ Root }, options) => () =>
  h (Provider, { "value": styletron (options).instance }, h (Root))
