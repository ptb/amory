import React from "./react.js"
import ReactDOM from "./react-dom.js"
import ReactDOMServer from "./react-dom-server.js"

const {
  Children,
  cloneElement,
  Component,
  createContext,
  createElement,
  createFactory,
  createRef,
  forwardRef,
  Fragment,
  isValidElement,
  PureComponent,
  StrictMode
} = React
const {
  createPortal,
  findDOMNode,
  flushSync,
  hydrate,
  render,
  unmountComponentAtNode
} = ReactDOM
const {
  renderToNodeStream,
  renderToStaticMarkup,
  renderToStaticNodeStream,
  renderToString
} = ReactDOMServer

export {
  Children,
  cloneElement,
  Component,
  createContext,
  createElement as h,
  createElement,
  createFactory,
  createPortal,
  createRef,
  findDOMNode,
  flushSync,
  forwardRef,
  Fragment,
  hydrate,
  isValidElement,
  PureComponent,
  render,
  renderToNodeStream,
  renderToStaticMarkup,
  renderToStaticNodeStream,
  renderToString,
  StrictMode,
  unmountComponentAtNode
}
