import { createBrowserHistory } from "history"
import { h } from "react"
import Router from "./Router.mjs"

export default (props) =>
  h (Router, {
    /* eslint-disable-next-line react/destructuring-assignment */
    "children": props.children,
    "history": createBrowserHistory (props)
  })
