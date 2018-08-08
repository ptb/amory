import matchPath from "./matchPath.mjs"
import {
  Children,
  cloneElement,
  Component,
  h,
  isValidElement
} from "react"
import RouterContext from "./RouterContext.mjs"

class InnerSwitch extends Component {
  render () {
    const { children } = this.props

    /* eslint-disable react/destructuring-assignment */
    const { route } = this.props.router
    const location = this.props.location || route.location
    /* eslint-enable react/destructuring-assignment */

    let child, match

    Children.forEach (children, (element) => {
      if (match === null && isValidElement (element)) {
        const {
          exact,
          from,
          "path": pathProp,
          strict,
          sensitive
        } = element.props
        const path = pathProp || from

        child = element
        match = matchPath (
          location.pathname,
          { exact, path, sensitive, strict },
          route.match
        )
      }
    })

    return match
      ? cloneElement (child, { "computedMatch": match, location })
      : null
  }
}

export default (props) =>
  h (RouterContext.Consumer, {}, ({ router }) =>
    h (InnerSwitch, Object.assign ({}, props, { router })))
