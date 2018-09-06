/* eslint-disable no-empty-function, no-magic-numbers, no-shadow */

import { createElement as h, forwardRef } from "./react.js"

import { BaseContext } from "./context.js"
import { Location } from "./location.js"
import { resolve, startsWith } from "./lib/utils.js"

const shouldNavigate = (e) =>
  !e.defaultPrevented &&
  e.button === 0 &&
  !(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)

const Link = forwardRef (({ innerRef, ... props }, ref) =>
  h (BaseContext.Consumer, {}, ({ baseuri }) =>
    h (Location, {}, ({ location, navigate }) => {
      const { getProps = () => {}, replace, state, to, ... linkProps } = props
      const href = resolve (to, baseuri)
      const isCurrent = location.pathname === href
      const isPartiallyCurrent = startsWith (location.pathname, href)

      return h ("a", {
        ... getProps ({ href, isCurrent, isPartiallyCurrent, location }),
        ... linkProps,
        "aria-current": isCurrent ? "page" : null,
        href,
        "onClick": (e) => {
          if (linkProps.onClick) {
            linkProps.onClick (e)
          }
          if (shouldNavigate (e)) {
            e.preventDefault ()
            navigate (href, { replace, state })
          }
        },
        "ref": ref || innerRef
      })
    })))

export { Link }
