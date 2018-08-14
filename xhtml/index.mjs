import content from "./content.mjs"

// import { h, hydrate, renderToString } from "./react.mjs"

import React from "react"
import ReactDOM from "react-dom"
import ReactDOMServer from "react-dom/server"

const h = React.createElement
const hydrate = ReactDOM.hydrate
const renderToString = ReactDOMServer.renderToString

if (typeof document !== "undefined") {
  hydrate (h (content), document.getElementById ("root"))
}

export default (props, ssr = false) =>
  (ssr ? renderToString (content (props)) : content (props))
