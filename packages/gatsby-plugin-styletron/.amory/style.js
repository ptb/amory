import instance from "@ptb/gatsby-plugin-styletron/instance"

const i = instance ()

export default {
  "css": (a) => i.renderStyle (a),
  "fnt": (b) => i.renderFontFace (b),
  "key": (c) => i.renderKeyframes (c)
}
