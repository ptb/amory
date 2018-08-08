/* eslint-disable max-statements, react/require-optimization */

import matchPath from "./matchPath.mjs"
import { Children, Component, h } from "react"
import RouterContext from "./RouterContext.mjs"

const isEmptyChildren = (children) =>
  /* eslint-disable-next-line no-magic-numbers */
  Children.count (children) === 0

const computeMatch = ({
  computedMatch,
  exact,
  location,
  path,
  router,
  strict,
  sensitive
}) => {
  if (computedMatch) {
    return computedMatch
  }

  const { route } = router
  const pathname = (location || route.location).pathname

  return matchPath (pathname, { exact, path, sensitive, strict }, route.match)
}

class InnerRoute extends Component {
  constructor (props) {
    super (props)

    this.state = {
      "match": computeMatch (props)
    }
  }

  getChildContext () {
    const { location, router } = this.props
    const { match } = this.state

    return {
      "router": Object.assign ({}, router, {
        "route": {
          "location": location || router.route.location,
          match
        }
      })
    }
  }

  static getDerivedStateFromProps (props) {
    return {
      "match": computeMatch (props)
    }
  }

  renderChildren () {
    const { match } = this.state
    const {
      children,
      component,
      render,
      /* eslint-disable-next-line no-shadow */
      "router": { history, route, staticContext }
    } = this.props
    /* eslint-disable-next-line react/destructuring-assignment */
    const location = this.props.location || route.location
    const props = { history, location, match, staticContext }

    if (component) {
      return match ? h (component, props) : null
    }

    if (render) {
      return match ? render (props) : null
    }

    if (typeof children === "function") {
      return children (props)
    }

    if (children && !isEmptyChildren (children)) {
      return Children.only (children)
    }

    return null
  }

  render () {
    return h (
      RouterContext.Provider,
      { "value": this.getChildContext () },
      this.renderChildren ()
    )
  }
}

export default (props) =>
  h (RouterContext.Consumer, {}, ({ router }) =>
    h (
      InnerRoute,
      Object.assign ({}, props, {
        "router": router
      })
    ))
