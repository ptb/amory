import keyframesToBlock from "./keyframes-to-block.mjs"

/**
 * @param {string} animationName
 *   Name specifying the animations that should be applied to an element.
 * @param {string} declarations
 *   Collection of property name and property value pairs.
 *
 * @returns {string} at-rule
 *   Ruleset which includes the animation-name and keyframe declarations.
 */
export default (animationName, declarations) =>
  `@keyframes ${animationName}{${declarations}}`
