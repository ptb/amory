import { createLocation, createPath } from "./history.mjs"
import objWithoutProps from "./objWithoutProps.mjs"
import { h, PureComponent } from "react"
import Router from "./Router.mjs"

const addLeadingSlash = (path) =>
  /* eslint-disable-next-line no-magic-numbers */
  (path.charAt (0) === "/" ? path : `/${path}`)

const addBasename = (basename, location) => {
  if (!basename) {
    return location
  }

  return Object.assign ({}, location, {
    "pathname": addLeadingSlash (basename) + location.pathname
  })
}

const stripBasename = (basename, location) => {
  if (!basename) {
    return location
  }

  const base = addLeadingSlash (basename)

  /* eslint-disable-next-line no-magic-numbers */
  if (location.pathname.indexOf (base) !== 0) {
    return location
  }

  return Object.assign ({}, location, {
    "pathname": location.pathname.substr (base.length)
  })
}

const createURL = (location) =>
  (typeof location === "string" ? location : createPath (location))

/* eslint-disable-next-line no-empty-function */
const noop = () => {}

class StaticRouter extends PureComponent {
  getChildContext () {
    const { context } = this.props

    return {
      "router": {
        "staticContext": context
      }
    }
  }

  createHref (path) {
    const { basename } = this.props

    addLeadingSlash (basename + createURL (path))
  }

  handlePush (location) {
    const { basename, context } = this.props

    context.action = "PUSH"
    context.location = addBasename (basename, createLocation (location))
    context.url = createURL (context.location)
  }

  handleReplace (location) {
    const { basename, context } = this.props

    context.action = "REPLACE"
    context.location = addBasename (basename, createLocation (location))
    context.url = createURL (context.location)
  }

  /* eslint-disable-next-line class-methods-use-this */
  handleListen () {
    noop ()
  }

  /* eslint-disable-next-line class-methods-use-this */
  handleBlock () {
    noop ()
  }

  render () {
    const { basename, location } = this.props
    const props = objWithoutProps (this.props, ["basename", "location"])

    const _history = {
      "action": "POP",
      "block": this.handleBlock,
      "createHref": this.createHref,
      "listen": this.handleListen,
      "location": stripBasename (basename, createLocation (location)),
      "push": this.handlePush,
      "replace": this.handleReplace
    }

    return h (
      Router,
      Object.assign ({}, props, {
        "history": _history,
        "router": this.getChildContext ().router
      })
    )
  }
}

StaticRouter.defaultProps = {
  "basename": "",
  "location": "/"
}

export default StaticRouter
