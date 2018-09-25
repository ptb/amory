import { createPortal, h, PureComponent } from "./react.mjs"

import cache from "./cache.mjs"
import canUseDOM from "./can-use-dom.mjs"
import getCss from "./get-css.mjs"
import getRuleset from "./get-ruleset.mjs"

export default class extends PureComponent {
  constructor (props) {
    super (props)

    if (canUseDOM) {
      this.nodes = document.head.querySelectorAll ("style.rehydrate")
    }

    this.state = {}
  }

  componentDidMount () {
    const regexes = {
      "font-face": /@font-face\{font-family:([^;]+)()?;([^}]*?)\}/g,
      "keyframes": /@keyframes ([^{]+)()?\{((?:[^{]+\{[^}]*\})*?)\}/g,
      "": /\.([^{:]+)(:[^{]+)?{(?:[^}]*;)?([^}]*?)}/g
    }

    this.nodes.forEach ((node) => {
      const { media, textContent } = node

      Object.entries (regexes).reduce ((styles, [ruletype, regex]) => {
        styles.replace (regex, (... results) => {
          const [ruleset, id, pseudo = "", block] = results
          const [i, r] = getRuleset ({ block, id, pseudo, ruleset, ruletype })

          cache (media) (`${pseudo}${block}`, { "id": i, "rule": r })
        })

        return styles.replace (regex, "")
      }, textContent)

      node.remove ()
    })
  }

  render () {
    this.setState (getCss ())

    const { render } = this.props
    const styles = Object.entries (getCss ())
      .map (([media = null, rules]) =>
        h ("style", {
          "className": "rehydrate",
          "dangerouslySetInnerHTML": { "__html": rules },
          "media": media || null
        }))

    switch (true) {
      case canUseDOM:
        return createPortal (styles, document.head)
      case render:
        return styles
      default:
        return null
    }
  }
}
