import instance from "@ptb/gatsby-plugin-styletron/instance"
import o from "../../gatsby-config.json"

const options = o.plugins
  .map ((a) => (a.resolve === "@ptb/gatsby-plugin-styletron" ? a.options : {}))
  .filter ((b) => Object.keys (b).length !== 0)[0]

const i = instance (options)

export default {
  "css": (a) => i.renderStyle (a),
  "fnt": (b) => i.renderFontFace (b),
  "key": (c) => i.renderKeyframes (c)
}
