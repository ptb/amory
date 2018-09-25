import atomicSelector from "./atomic-selector.mjs"
import fontFaceToRule from "./font-face-to-rule.mjs"
import keyframesToRule from "./keyframes-to-rule.mjs"
import stylesToRule from "./styles-to-rule.mjs"

/**
 * @param {string} ruletype
 *   Enumerated property which determines how a declaration should be added.
 *
 * @returns {function}
 *   Function to add specific declaration type to the style cache.
 */
export default (ruletype) => {
  switch (ruletype) {
    case "font-face":
      return (fontFamily, { block }) =>
        fontFaceToRule (fontFamily, block)
    case "keyframes":
      return (animationName, { block }) =>
        keyframesToRule (animationName, block)
    default:
      return (id, { block, pseudo }) =>
        stylesToRule (atomicSelector (id, pseudo), block)
  }
}
