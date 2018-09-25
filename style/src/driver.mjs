import getClassNames from "./get-class-names.mjs"
import renderDeclarativeRules from "./render-declarative-rules.mjs"

/**
 * @param {object} declarations
 *   Collection of property name and property value pairs.
 *
 * @returns {string} className(s)
 */
export default (declarations) =>
  getClassNames (renderDeclarativeRules (declarations))
