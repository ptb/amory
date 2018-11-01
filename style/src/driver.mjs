import getClassNames from "./get-class-names.mjs"
import renderDeclarativeRules from "./render-declarative-rules.mjs"

/**
 * @example
 *
 * @param {Object} declarations
 * - Collection of property name and property value pairs.
 * @param {string} prefix
 * -
 *
 * @returns {string}
 *   ClassNames (s).
 */
export default (declarations, prefix = "") =>
  getClassNames (renderDeclarativeRules (declarations, prefix), prefix)
