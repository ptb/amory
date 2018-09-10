import { createElement as h } from "./react.js"

export default ({ count, decreaseCount }) =>
  h ("button", { "onClick": () => decreaseCount (count - 1) }, "-")
