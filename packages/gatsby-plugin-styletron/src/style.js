import instance from "./instance.js"

const css = (a) => instance.renderStyle (a)
const fnt = (b) => instance.renderFontFace (b)
const key = (c) => instance.renderKeyframes (c)

export { css, fnt, key }
