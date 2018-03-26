import instance from "@ptb/gatsby-plugin-styletron/instance"

const styletron = instance ()

export default {
  "css": (a) => styletron.renderStyle (a),
  "fnt": (b) => styletron.renderFontFace (b),
  "key": (c) => styletron.renderKeyframes (c)
}
