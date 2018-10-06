import cacheFontFace from "./cache-font-face.mjs"
import cacheKeyframes from "./cache-keyframes.mjs"

/**
 * @example
 *
 * @param {Object} declarations
 * - Collection of property name and property value pairs.
 *
 * @returns {Object}
 *   Structure that groups declarations delimited by braces/curly brackets.
 */
const renderDeclarativeRules = (declarations) =>
  Object.entries (declarations).reduce ((block, [property, value]) => {
    if (property === "fontFamily" && typeof value !== "string") {
      block.fontFamily = cacheFontFace (value).id
    } else if (property === "animationName" && typeof value !== "string") {
      block.animationName = cacheKeyframes (value).id
    } else if (typeof value === "object" && value !== null) {
      renderDeclarativeRules (value)
    }

    return block
  }, declarations)

export default renderDeclarativeRules
