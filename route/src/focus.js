/* eslint-disable no-magic-numbers, no-undefined,
    react/no-did-mount-set-state, react/no-set-state */

import { Component, createElement as h } from "./react.js"

import { FocusContext } from "./context.js"

class FocusHandlerImpl extends Component {
  constructor (props) {
    super (props)

    this.state = {
      "initialRender": true
    }

    this.requestFocus = (node) => {
      const { shouldFocus } = this.state

      if (!shouldFocus) {
        node.focus ()
      }
    }
  }

  static getDerivedStateFromProps ({ location, uri, ... props }, state) {
    if (state.uri === undefined) {
      return { "shouldFocus": true, ... props }
    }

    const myURIChanged = uri !== state.uri
    const navigatedUpToMe =
      location.pathname === uri &&
      state.location.pathname !== location.pathname

    return { "shouldFocus": myURIChanged || navigatedUpToMe, ... props }
  }

  componentDidMount () {
    this.setState ((state) => ({
      ... state,
      "focusHandlerCount": state.focusHandlerCount + 1
    }))
    this.focus ()
  }

  componentDidUpdate (prevProps) {
    const { location } = this.props
    const { shouldFocus } = this.state

    if (prevProps.location !== location && shouldFocus) {
      this.focus ()
    }
  }

  componentWillUnmount () {
    this.setState ((state) => ({
      ... state,
      "focusHandlerCount": state.focusHandlerCount - 1,
      "initialRender":
        state.focusHandlerCount === 1 ? true : state.initialRender
    }))
  }

  focus () {
    const { requestFocus } = this.props
    const { initialRender } = this.state

    if (requestFocus) {
      requestFocus (this.node)
    } else if (initialRender) {
      this.setState ({ "initialRender": false })
    } else {
      this.node.focus ()
    }
  }

  render () {
    const {
      children,
      "component": Wrapper = "div",
      role = "group",
      style,
      ... domProps
    } = this.props;

    ["location", "requestFocus", "uri"].forEach ((x) => delete domProps[x])

    return h (
      Wrapper,
      {
        "ref": (n) => {
          this.node = n
        },
        "role": role,
        "style": { "outline": "none", ... style },
        "tabIndex": "-1",
        ... domProps
      },
      h (FocusContext.Provider, { "value": this.requestFocus }, children)
    )
  }
}

const FocusHandler = (props) =>
  h (FocusContext.Consumer, {}, (requestFocus) =>
    h (FocusHandlerImpl, { ... props, requestFocus }))

export { FocusHandler }
