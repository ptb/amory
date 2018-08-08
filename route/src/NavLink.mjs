import Link from "./Link.mjs"
import objWithoutProps from "./objWithoutProps.mjs"
import { h } from "react"
import Route from "./Route.mjs"

/* eslint-disable max-statements */
const NavLink = (args = {}) => {
  const ariaCurrent = args.ariaCurrent
  const activeClassName = args.activeClassName
  const activeStyle = args.activeStyle
  const className = args.className
  const exact = args.exact
  const getIsActive = args.getIsActive
  const location = args.location
  const strict = args.strict
  const style = args.style
  const to = args.to
  const rest = objWithoutProps (args, [
    "ariaCurrent",
    "activeClassName",
    "activeStyle",
    "className",
    "exact",
    "getIsActive",
    "location",
    "strict",
    "style",
    "to"
  ])
  const path = typeof to === "object" ? to.pathname : to

  // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L208
  const escapedPath =
    path && path.replace (/([.+*?=^!:${}()[\]|/\\])/g, "\\$1")

  return h (Route, {
    "children": ({ location, match }) => {
      const isActive = Boolean (
        getIsActive ? getIsActive (match, location) : match
      )

      return h (
        Link,
        Object.assign (
          {},
          {
            "aria-current": isActive && ariaCurrent || null,
            "className": isActive
              ? [className, activeClassName].filter ((i) => i).join (" ")
              : className,
            "style": isActive ? Object.assign ({}, style, activeStyle) : style,
            "to": to
          },
          rest
        )
      )
    },
    "exact": exact,
    "location": location,
    "path": escapedPath,
    "strict": strict
  })
}

NavLink.defaultProps = {
  "activeClassName": "active",
  "aria-current": "page"
}

export default NavLink
