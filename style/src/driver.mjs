import getClassNames from "./get-class-names.mjs"
import renderDeclarativeRules from "./render-declarative-rules.mjs"

/**
 * @example
 *
 * @param {Object} declarations
 * - Collection of property name and property value pairs.
 *
 * @returns {string}
 *   ClassNames (s).
 */
export default (declarations) =>
  getClassNames (renderDeclarativeRules (declarations))
