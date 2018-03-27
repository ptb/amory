import instance from "./instance.js"

export default {
  "css": (a) => instance.renderStyle (a),
  "fnt": (b) => instance.renderFontFace (b),
  "key": (c) => instance.renderKeyframes (c)
}
