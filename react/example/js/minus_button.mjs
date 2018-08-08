import { createElement as h } from "./react.mjs"

export default ({ count, decreaseCount }) =>
  h ("button", { "onClick": () => decreaseCount (count - 1) }, "-")
