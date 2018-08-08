import { createLocation } from "history"
import objWithoutProps from "./objWithoutProps.mjs"
import { Component, h } from "react"
import RouterContext from "./RouterContext.mjs"

const isModifiedEvent = (e) =>
  Boolean (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)

class Link extends Component {
  handleClick (_history, e) {
    const { onClick, replace, target, to } = this.props

    if (onClick) {
      onClick (e)
    }

    if (
      !e.defaultPrevented &&
      /* eslint-disable-next-line no-magic-numbers */
      e.button === 0 &&
      !target &&
      !isModifiedEvent (e)
    ) {
      e.preventDefault ()

      if (replace) {
        _history.replace (to)
      } else {
        _history.push (to)
      }
    }
  }

  render () {
    const { to, innerRef } = this.props
    const props = objWithoutProps (this.props, ["innerRef", "to"])

    return h (RouterContext.Consumer, {}, ({ router }) => {
      /* eslint-disable-next-line no-shadow */
      const { history } = router
      const location =
        typeof to === "string"
          ? createLocation (to, null, null, history.location)
          : to
      const href = history.createHref (location)

      return h ("a", Object.assign ({}, props, {
        "href": href,
        "onClick": (e) => this.handleClick (history, e),
        "ref": innerRef
      }))
    })
  }
}

Link.defaultProps = {
  "replace": false
}

export default Link
