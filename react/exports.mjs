import React from "./node_modules/react/cjs/react.production.min.js"
import ReactDOM from "./node_modules/react-dom/cjs/react-dom.production.min.js"
import ReactDOMServer from "./node_modules/react-dom/cjs/react-dom-server.browser.production.min.js"

const {
  Children,
  cloneElement,
  Component,
  createElement,
  Fragment
} = React
const {
  hydrate,
  render
} = ReactDOM
const {
  renderToString,
  renderToStaticMarkup
} = ReactDOMServer

export {
  Children,
  cloneElement,
  Component,
  createElement,
  createElement as h,
  Fragment,
  hydrate,
  render,
  renderToString,
  renderToStaticMarkup
}
