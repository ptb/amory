import generatePath from "./generatePath.mjs"
import { createLocation, locationsAreEqual } from "./history.mjs"
import { h, PureComponent } from "react"
import RouterContext from "./RouterContext.mjs"

const computeTo = ({ computedMatch, to }) => {
  if (computedMatch) {
    if (typeof to === "string") {
      return generatePath (to, computedMatch.params)
    }
    return Object.assign ({}, to, {
      "pathname": generatePath (to.pathname, computedMatch.params)
    })
  }

  return to
}

class InnerRedirect extends PureComponent {
  constructor (props) {
    super (props)

    if (this.isStatic ()) {
      this.perform ()
    }
  }

  componentDidMount () {
    if (!this.isStatic ()) {
      this.perform ()
    }
  }

  componentDidUpdate (prevProps) {
    const prevTo = createLocation (prevProps.to)
    /* eslint-disable-next-line react/destructuring-assignment */
    const nextTo = createLocation (this.props.to)

    if (locationsAreEqual (prevTo, nextTo)) {
      return
    }

    this.perform ()
  }

  isStatic () {
    const { router } = this.props

    return router && router.staticContext
  }

  perform () {
    const to = computeTo (this.props)
    const {
      push,
      /* eslint-disable-next-line no-shadow */
      "router": { history }
    } = this.props

    if (push) {
      history.push (to)
    } else {
      history.replace (to)
    }
  }

  /* eslint-disable class-methods-use-this */
  render () {
    return null
  }
}

InnerRedirect.defaultProps = {
  "push": false
}

export default (props) =>
  h (RouterContext.Consumer, {}, ({ router }) =>
    h (InnerRedirect, Object.assign ({}, props, { router })))
