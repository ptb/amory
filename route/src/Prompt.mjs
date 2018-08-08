import { h, PureComponent } from "react"
import RouterContext from "./RouterContext.mjs"

class InnerPrompt extends PureComponent {
  constructor (props) {
    super (props)

    if (props.when) {
      this.enable (props.message)
    }
  }

  componentDidUpdate (prevProps) {
    const { message, when } = this.props

    if (when) {
      if (!prevProps.when || prevProps.message !== message) {
        this.enable (message)
      }
    } else {
      this.disable ()
    }
  }

  componentWillUnmount () {
    this.disable ()
  }

  disable () {
    if (this.unblock) {
      this.unblock ()
      this.unblock = null
    }
  }

  enable (message) {
    const { router } = this.props

    if (this.unblock) {
      this.unblock ()
    }

    this.unblock = router.history.block (message)
  }

  /* eslint-disable class-methods-use-this */
  render () {
    return null
  }
}

InnerPrompt.defaultProps = {
  "when": true
}

export default (props) =>
  h (RouterContext.Consumer, {}, ({ router }) =>
    h (InnerPrompt, Object.assign ({}, props, { router })))
