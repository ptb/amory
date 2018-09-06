/* eslint-disable max-statements, no-shadow, no-use-before-define */

import {
  Children,
  cloneElement,
  createElement as h,
  PureComponent
} from "./react.js"

import { BaseContext } from "./context.js"
import { FocusHandler } from "./focus.js"
import { Location } from "./location.js"
import { Redirect } from "./redirect.js"
import { pick, resolve } from "./lib/utils.js"

const stripSlashes = (str) => str.replace (/(^\/+|\/+$)/g, "")

const createRoute = (basepath) => (element) => {
  if (element.props.default) {
    return { "default": true, "value": element }
  }

  const elementPath =
      element.type === Redirect ? element.props.from : element.props.path

  const path =
      elementPath === "/"
        ? basepath
        : `${stripSlashes (basepath)}/${stripSlashes (elementPath)}`

  return {
    "default": element.props.default,
    "path": element.props.children ? `${stripSlashes (path)}/*` : path,
    "value": element
  }
}

class RouterImpl extends PureComponent {
  render () {
    const {
      children,
      component = "div",
      location,
      navigate,
      primary,
      ... domProps
    } = this.props

    let { basepath } = this.props

    const routes = Children.map (children, createRoute (basepath))

    const { pathname } = location

    const match = pick (routes, pathname)

    if (match) {
      const {
        params,
        route,
        "route": { "value": element },
        uri
      } = match

      // remove the /* from the end for child routes relative paths
      basepath = route.default ? basepath : route.path.replace (/\*$/, "")

      // using 'div' for < 16.3 support
      const FocusWrapper = primary ? FocusHandler : component

      // don't pass any props to 'div'
      const wrapperProps = primary
        ? { component, location, uri, ... domProps }
        : domProps

      const props = {
        ... params,
        location,
        "navigate": (to, options) => navigate (resolve (to, uri), options),
        uri
      }

      const clone = cloneElement (
        element,
        props,
        element.props.children
          ? h (Router, { primary }, element.props.children)
          : null
      )

      return h (
        BaseContext.Provider,
        { "value": { basepath, "baseuri": uri } },
        h (FocusWrapper, wrapperProps, clone)
      )
    }
    return null
  }
}

RouterImpl.defaultProps = {
  "primary": true
}

const Router = (props) =>
  h (BaseContext.Consumer, {}, (baseCtx) =>
    h (Location, {}, (locationCtx) =>
      h (RouterImpl, { ... baseCtx, ... locationCtx, ... props })))

export { Router }
