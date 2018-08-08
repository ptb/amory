import { createElement as h } from "./react.mjs"

export default ({ count }) =>
  h ("div", { "className": "counter" }, `Current count: ${count}`)
