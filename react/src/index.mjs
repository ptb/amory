import React from "react"
import ReactDOM from "react-dom"
import ReactDOMServer from "react-dom/server"

const {
  Children,
  cloneElement,
  Component,
  createContext,
  createElement,
  Fragment,
  isValidElement,
  PureComponent
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
  createContext,
  createElement,
  createElement as h,
  Fragment,
  hydrate,
  isValidElement,
  PureComponent,
  render,
  renderToString,
  renderToStaticMarkup
}
