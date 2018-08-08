import { createElement as h } from "./react.mjs"

export default ({ count, increaseCount }) =>
  h ("button", { "onClick": () => increaseCount (count + 1) }, "+")
