import { createElement as h } from "./react.js"

export default ({ count, increaseCount }) =>
  h ("button", { "onClick": () => increaseCount (count + 1) }, "+")
