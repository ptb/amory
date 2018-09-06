/* eslint-disable compat/compat, func-style, require-jsdoc */

import { Component, createElement as h } from "./react.js"

import { insertParams } from "./lib/utils.js"

function RedirectRequest (uri) {
  this.uri = uri
}

const redirectTo = (uri) => {
  throw new RedirectRequest (uri)
}

class RedirectImpl extends Component {
  // Support React < 16 with this hook
  componentDidMount () {
    const { navigate, replace = true, state, to, ... props } = this.props

    Promise.resolve ().then (() => {
      navigate (insertParams (to, props), { replace, state })
    })
  }

  render () {
    const { noThrow, to, ... props } = this.props

    if (!noThrow) {
      redirectTo (insertParams (to, props))
    }
    return null
  }
}

const Redirect = (props) =>
  h (Location, {}, (locationContext) =>
    h (RedirectImpl, { ... locationContext, ... props }))

export { Redirect, RedirectRequest, redirectTo }
