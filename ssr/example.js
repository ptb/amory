import { h, hydrate, renderToString } from "./react.mjs"

const content = (props) =>
  h ("div", { "path": "" }, h ("div", { "path": "i" }, "Hi!"))

if (typeof document !== "undefined") {
  hydrate (h (content), document.getElementById ("root"))
}

export default (props, ssr = false) =>
  (ssr ? renderToString (content (props)) : content (props))
