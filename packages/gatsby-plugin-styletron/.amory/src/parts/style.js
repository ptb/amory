import instance from "@ptb/gatsby-plugin-styletron/instance"

export default {
  "css": (a) => instance.renderStyle (a),
  "fnt": (b) => instance.renderFontFace (b),
  "key": (c) => instance.renderKeyframes (c)
}
