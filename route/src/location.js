/* eslint-disable camelcase, compat/compat, no-shadow,
    react/destructuring-assignment, react/no-set-state, */

import {
  Component,
  createElement as h,
  unstable_deferredUpdates
} from "./react.js"

import { LocationContext } from "./context.js"
import { globalHistory } from "./lib/history.js"
import { RedirectRequest } from "./redirect.js"

const isRedirect = (redirect) => redirect instanceof RedirectRequest

class LocationProvider extends Component {
  constructor (props) {
    super (props)

    this.state = {
      "context": this.getContext (),
      "refs": {
        "unlisten": null
      }
    }
  }

  componentDidMount () {
    const { history } = this.props
    const { refs } = this.state

    refs.unlisten = history.listen (() => {
      Promise.resolve ().then (() => {
        unstable_deferredUpdates (() => {
          if (!this.unmounted) {
            this.setState (() => ({ "context": this.getContext () }))
          }
        })
      })
    })
  }

  componentDidUpdate (_, prevState) {
    const { history } = this.props
    const { context } = this.state

    if (prevState.context.location !== context.location) {
      history._onTransitionComplete ()
    }
  }

  componentDidCatch (error) {
    if (isRedirect (error)) {
      const { navigate } = this.props.history

      navigate (error.uri, { "replace": true })
    } else {
      throw new Error (error)
    }
  }

  componentWillUnmount () {
    const { refs } = this.state

    this.unmounted = true
    refs.unlisten ()
  }

  getContext () {
    const { location, navigate } = this.props.history

    return { location, navigate }
  }

  render () {
    const { children } = this.props
    const { context } = this.state

    return h (
      LocationContext.Provider,
      { "value": context },
      typeof children === "function" ? children (context) : children || null
    )
  }
}

LocationProvider.defaultProps = {
  "history": globalHistory
}

// sets up a listener if there isn't one already so apps don't need to be
// wrapped in some top level provider
const Location = ({ children }) =>
  h (
    LocationContext.Consumer,
    {},
    (context) =>
      (context ? children (context) : h (LocationProvider, {}, children))
  )

const ServerLocation = ({ children, url }) =>
  h (
    LocationContext.Provider,
    {
      "value": {
        "location": { "pathname": url },
        "navigate": () => {
          throw new Error ("You can't call navigate on the server.")
        }
      }
    },
    children
  )

export { isRedirect, Location, LocationProvider, ServerLocation }
