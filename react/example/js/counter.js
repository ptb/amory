import { createElement as h } from "./react.js"

export default ({ count }) =>
  h ("div", { "className": "counter" }, `Current count: ${count}`)
