import { Children, Component, h } from "react"
import RouterContext from "./RouterContext.mjs"

const computeMatch = (pathname) => ({
  "isExact": pathname === "/",
  "params": {},
  "path": "/",
  "url": "/"
})

export default class extends Component {
  constructor (props) {
    super (props)

    /* eslint-disable-next-line no-shadow */
    const { history } = props

    this.state = {
      "match": computeMatch (history.location.pathname)
    }
  }

  getChildContext () {
    /* eslint-disable-next-line no-shadow */
    const { history, router } = this.props
    const { match } = this.state

    return {
      "router": Object.assign ({}, router, {
        history,
        "route": { "location": history.location, match }
      })
    }
  }

  componentDidMount () {
    /* eslint-disable-next-line no-shadow */
    const { history } = this.props

    this.unlisten = history.listen (() => {
      /* eslint-disable-next-line react/no-set-state */
      this.setState ({
        "match": computeMatch (history.location.pathname)
      })
    })
  }

  componentWillUnmount () {
    this.unlisten ()
  }

  render () {
    const { children } = this.props

    return h (
      RouterContext.Provider,
      { "value": this.getChildContext () },
      children ? Children.only (children) : null
    )
  }
}
