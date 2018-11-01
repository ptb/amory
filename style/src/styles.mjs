import { createElement as h, PureComponent } from "../react.mjs"
import { createPortal } from "../react.mjs"

import css from "./driver.mjs"
import getCss from "./get-css.mjs"
import parseCss from "./parse-css.mjs"
import pubSub from "./pub-sub.mjs"

export default class Style extends PureComponent {
  constructor (props) {
    super (props)

    this.canUseDOM = Boolean (
      typeof window !== "undefined" &&
      window.document &&
      window.document.createElement
    )

    if (this.canUseDOM) {
      this.nodes = document.head.querySelectorAll ("style.rehydrate")
      parseCss (this.nodes)
      window.css = css
    }

    this.state = {
      "value": getCss ()
    }

    this._hasUnmounted = false
    this.unsub = () => null
  }

  componentDidMount () {
    this.nodes.forEach ((node) => node.remove ())
    this.subscribe ()
  }

  componentWillUnmount () {
    this.unsub ()
    this._hasUnmounted = true
  }

  subscribe () {
    const callback = (value) => {
      if (this._hasUnmounted) {
        return
      }

      /* eslint-disable-next-line react/no-set-state */
      this.setState ((state) => {
        if (value === state.value) {
          return null
        }

        return { value }
      })
    }

    this.unsub = pubSub.sub (callback)

    const v = getCss ()

    /* eslint-disable-next-line react/destructuring-assignment */
    if (v !== this.state.value) {
      /* eslint-disable-next-line react/no-set-state */
      this.setState ({ "value": v })
    }
  }

  render () {
    const { render } = this.props
    const { value } = this.state

    const styles = Object.entries (value)
      .map (([media, rules]) =>
        h ("style", {
          "className": "rehydrate",
          "dangerouslySetInnerHTML": {
            "__html": `/*<![CDATA[*/${rules}/*]]>*/`
          },
          "media": media || null
        }))

    switch (true) {
      case this.canUseDOM:
        return createPortal (styles, document.head)
      case render:
        return styles
      default:
        return null
    }
  }
}
