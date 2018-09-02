import React from "react"
import ReactDOM from "react-dom"
import ReactDOMServer from "react-dom/server"

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
  unmountComponentAtNode,
  unstable_batchedUpdates
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
  unmountComponentAtNode,
  unstable_batchedUpdates
}
