import renderFontFace from "./render-font-face.mjs"
import renderKeyframes from "./render-keyframes.mjs"

/**
 * @param {object} declarations
 *   Collection of property name and property value pairs.
 *
 * @returns {object} block
 *   Structure that groups declarations delimited by braces/curly brackets.
 */
const renderDeclarativeRules = (declarations) =>
  Object.entries (declarations).reduce ((block, [property, value]) => {
    if (property === "animationName" && typeof value !== "string") {
      block.animationName = renderKeyframes (value)
    } else if (property === "fontFamily" && typeof value !== "string") {
      block.fontFamily = renderFontFace (value)
    } else if (typeof value === "object" && value !== null) {
      renderDeclarativeRules (value)
    }

    return block
  }, declarations)

export default renderDeclarativeRules
